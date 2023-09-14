import os
import sqlite3
from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import or_
from markupsafe import Markup
from config.links_mapping import mapping

app = Flask(__name__, template_folder='./templates')
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'hatethework.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Hatethework(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    year = db.Column(db.String(50))
    brand = db.Column(db.String(50))
    entrant_company = db.Column(db.String(50))
    title = db.Column(db.String(50))
    lion = db.Column(db.String(50))
    section = db.Column(db.String(50))
    category = db.Column(db.String(50))
    award = db.Column(db.String(50))

    def __repr__(self):
        return '<Hatethework %r>' % self.id

def get_data(search=None, lion=None, section=None, category=None, year=None, award=None):
    query = Hatethework.query

    if search:
        search = f'%{search}%'
        query = query.filter(or_(
            Hatethework.title.ilike(search),
            Hatethework.brand.ilike(search),
            Hatethework.entrant_company.ilike(search)
        )).order_by(Hatethework.title)


    if lion:
        query = query.filter_by(lion=lion)

    if section:
        query = query.filter_by(section=section)

    if category:
        query = query.filter_by(category=category)

    if year:
        query = query.filter_by(year=year)

    if award:
        if isinstance(award, list):
            query = query.filter(Hatethework.award.in_(award))
        else:
            query = query.filter_by(award=award)

    results = query.all()

    data = []
    for row in results:
        title = row.title
        link = None  # Initialize the link variable
        if title in mapping:
            link = mapping[title]
            title = Markup(f'<a href="{link}" target="_blank">{title}</a>').__html__()  # Convert Markup to string

        data.append({
            'id': row.id,
            'year': row.year,
            'brand': row.brand,
            'entrant_company': row.entrant_company,
            'title': title,
            'lion': row.lion,
            'section': row.section,
            'category': row.category,
            'award': row.award,
            'link': link  # Add the link to the data dictionary
        })

    return data

AWARD_ORDER = ['Titanium Grand Prix', 'Titanium Lion', 'Grand Prix', 'Grand Prix for Good','Grand Prix For Good Health', 'Gold Lion', 'Silver Lion', 'Bronze Lion', 'Shortlisted', 'None']

def custom_order(item):
    try:
        return AWARD_ORDER.index(item)
    except ValueError:  # if the item is not in our custom list, place it at the end
        return len(AWARD_ORDER)

def get_unique_values(column):
    unique_values_query = db.session.query(getattr(Hatethework, column)).distinct()

    if column == 'award':
        unique_values = sorted(unique_values_query.all(), key=lambda x: (x[0] is None, custom_order(x[0] if x[0] is not None else '')))
    else:
        unique_values = sorted(unique_values_query.all(), key=lambda x: (x[0] is None, x[0]))

    return [value[0] for value in unique_values]



@app.route('/')
def home():
    lions = get_unique_values('lion')
    sections = get_unique_values('section')
    categories = get_unique_values('category')
    awards = get_unique_values('award')
    award = request.args.get('award', '')

    return render_template('index.html', lions=lions, sections=sections, categories=categories, awards=awards, award=award)

@app.route('/get-data', methods=['GET'])
def get_filtered_data():
    search_filter = request.args.get('search')
    lion_filter = request.args.get('lion')
    section_filter = request.args.get('section').strip()
    category_filter = request.args.get('category')
    year_filter = request.args.get('year')
    award_filters = request.args.get('awards')
    if award_filters:
            awards_list = award_filters.split(',')
            query = query.filter(Hatethework.award.in_(awards_list))
        


    data = get_data(search=search_filter, lion=lion_filter, section=section_filter, category=category_filter, year=year_filter, award=award_filters)
    return jsonify(data)

def get_sections_for_lion(lion):
    sections = Hatethework.query.with_entities(Hatethework.section).filter_by(lion=lion).order_by(Hatethework.section).distinct().all()
    return [sec[0].strip() for sec in sections if sec[0] is not None]

def get_categories_for_section_and_lion(section, lion):
    categories = Hatethework.query.with_entities(Hatethework.category).filter_by(section=section, lion=lion).order_by(Hatethework.category).distinct().all()
    return [cat[0].strip() for cat in categories if cat[0] is not None]

@app.route('/get-categories', methods=['GET'])
def get_categories():
    section = request.args.get('section', None)
    lion = request.args.get('lion', None)

    query = Hatethework.query.with_entities(Hatethework.category).distinct()

    if section:
        query = query.filter_by(section=section)

    if lion:
        query = query.filter_by(lion=lion)

    categories = query.order_by(Hatethework.category).all()

    return jsonify([cat[0].strip() for cat in categories if cat[0] is not None])


@app.route('/get-sections', methods=['GET'])
def get_sections():
    lion = request.args.get('lion', '')
    sections = get_sections_for_lion(lion)
    if sections:
        return jsonify([section for section in sections if section is not None])
    return jsonify([])

@app.route('/about')
def about():
    return render_template('about.html')


if __name__ == '__main__':
    app.run(debug=True)
