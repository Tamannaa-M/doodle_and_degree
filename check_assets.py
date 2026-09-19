import urllib.request
import re

req = urllib.request.Request('https://doodle-and-degree.tamannaamanchikanti.workers.dev/', headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req).read().decode('utf-8')
print("HTML length:", len(html))
for m in re.findall(r'(?:href|src)=["\']([^"\']+)["\']', html):
    print("Found asset:", m)
