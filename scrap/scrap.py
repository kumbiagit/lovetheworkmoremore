import requests
from bs4 import BeautifulSoup

url = "https://lovetheworkmore.com/2017-2/"
response = requests.get(url)
soup = BeautifulSoup(response.text, "html.parser")

filtered_links = {}

for link in soup.find_all("a"):
    if "href" in link.attrs:
        href = link["href"]
        filtered_text = link.text.split(" – ")[0].split(" - ")[0].strip()
        filtered_links[filtered_text] = href

for text, href in filtered_links.items():
    print(f'"{text}": "{href}",')
