import pandas as pd
from app import app, db, Hatethework

# Replace 'your_excel_file.xlsx' with the path to your Excel file
excel_file = 'hatethework.xlsx'

# Read the Excel file using pandas
df = pd.read_excel(excel_file, engine='openpyxl')

# Convert the DataFrame to a list of dictionaries
records = df.to_dict('records')

# Importing the Excel file into the Hatethework table
with app.app_context():
    for record in records:
        # Convert the keys (column names) to lowercase and replace spaces with underscores
        record = {key.lower().replace(' ', '_'): value for key, value in record.items()}
        row = Hatethework(**record)
        db.session.add(row)

    db.session.commit()


print(f"Imported {len(records)} records from {excel_file} into the Hatethework table.")