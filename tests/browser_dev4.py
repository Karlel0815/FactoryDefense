from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1]
markup=(root/'preview.html').read_text(encoding='utf-8')
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 for ismobile in [False,True]:
  page=browser.new_page(viewport={'width':390 if ismobile else 1280,'height':844 if ismobile else 800},device_scale_factor=1,is_mobile=ismobile,has_touch=ismobile)
  errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.set_content(markup,wait_until='domcontentloaded')
  page.wait_for_timeout(750)
  assert not errors,errors
  assert page.locator('#factories').inner_text()=='1'
  assert '0 / 0' in page.locator('#turrets').inner_text()
  assert page.locator('#ore').inner_text().split('/')[0].strip()!='0.0'
  # First blue ammo belt already beside factory; MG cell 3,5 touches its end.
  page.locator('[data-mode="turret"]').click();page.locator('#board').scroll_into_view_if_needed()
  rect=page.locator('#board').bounding_box()
  x=rect['x']+rect['width']*(3.5/20);y=rect['y']+rect['height']*(5.5/12)
  if ismobile:page.touchscreen.tap(x,y)
  else:page.mouse.click(x,y)
  page.wait_for_timeout(150)
  assert page.locator('#turrets').inner_text()=='1 / 1',page.locator('#turrets').inner_text()
  before=float(page.locator('#material').inner_text().split('/')[0])
  # Try placing an ore belt on an ammo tile; it must fail without cost.
  page.locator('[data-mode="ore"]').click();page.locator('#board').scroll_into_view_if_needed()
  rect=page.locator('#board').bounding_box();x=rect['x']+rect['width']*(2.5/20);y=rect['y']+rect['height']*(5.5/12)
  if ismobile:page.touchscreen.tap(x,y)
  else:page.mouse.click(x,y)
  page.wait_for_timeout(110)
  assert float(page.locator('#material').inner_text().split('/')[0])>=before-0.5
  # Order offense and verify queue; real unit spawn checked in model tests.
  page.locator('#order-unit').click();page.wait_for_timeout(100)
  assert '1 im Bau' in page.locator('#unit-status').inner_text(),page.locator('#unit-status').inner_text()
  page.locator('#wave-button').click();page.wait_for_timeout(240)
  assert 'Angriffswelle 1' in page.locator('#wave-status').inner_text(),page.locator('#wave-status').inner_text()
  assert page.locator('#undo').is_disabled()
  assert not errors,errors
  page.screenshot(path=str(root/('mobile.png' if ismobile else 'desktop.png')),full_page=True)
  print('SIMULATED TOUCH PASS' if ismobile else 'DESKTOP PASS',page.locator('#material').inner_text(),'errors',errors)
  page.close()
 browser.close()
