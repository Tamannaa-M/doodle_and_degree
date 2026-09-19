import urllib.request

test_urls = [
    'https://doodle-and-degree.tamannaamanchikanti.workers.dev/static/js/tailwind-local.js',
    'https://doodle-and-degree.tamannaamanchikanti.workers.dev/static/css/style.css',
    'https://doodle-and-degree.tamannaamanchikanti.workers.dev/static/css/upgrade.css',
    'https://doodle-and-degree.tamannaamanchikanti.workers.dev/static/mascot.svg',
    'https://doodle-and-degree.tamannaamanchikanti.workers.dev/static/js/app.js',
]

for u in test_urls:
    try:
        req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})
        res = urllib.request.urlopen(req)
        content_type = res.headers.get('Content-Type')
        data = res.read()
        print(f"{res.status} | Content-Type: {content_type} | Length: {len(data)} | {u}")
        if 'text/html' in str(content_type):
            print("  --> WARNING: Returned HTML instead of static asset!")
    except Exception as e:
        print(f"FAILED: {e} | {u}")
