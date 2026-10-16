from playwright.sync_api import sync_playwright
from pathlib import Path

root = Path(__file__).resolve().parents[1]
markup=(root / 'preview.html').read_text(encoding='utf-8')
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 page=browser.new_page(viewport={'width':1280,'height':800},device_scale_factor=1)
 errors=[];page.on('pageerror',lambda error:errors.append(str(error)))
 page.set_content(markup,wait_until='domcontentloaded');page.wait_for_timeout(700)
 print('Title:',page.title())
 print('HUD:',page.locator('#wave-status').inner_text(), 'errors=',errors)
 print('Controls:',page.locator('[data-mode]').count())
 page.screenshot(path=str(root / 'desktop.png'),full_page=True)
 assert not errors,errors
 material_before = float(page.locator('#material').inner_text().split(' / ')[0])
 page.locator('[data-mode="turret"]').click()
 canvas=page.locator('#board');canvas.scroll_into_view_if_needed()
 rect=canvas.bounding_box();print('bounds',rect)
 # canvas grid 20x12, turret adjacent to road at (3,5)
 page.mouse.click(rect['x']+rect['width']*(3.5/20),rect['y']+rect['height']*(5.5/12))
 page.wait_for_timeout(300)
 print('After build: Material',page.locator('#material').inner_text())
 assert 13 < material_before-float(page.locator('#material').inner_text().split(' / ')[0]) < 15,page.locator('#material').inner_text()
 # Advance wave manually and check it is live and spawns
 page.locator('#wave-button').click()
 page.wait_for_timeout(350)
 print('Wave:',page.locator('#wave-status').inner_text(), 'enemies:',page.locator('#enemy-count').inner_text())
 assert 'Angriffswelle 1' in page.locator('#wave-status').inner_text()
 assert int(page.locator('#enemy-count').inner_text()) >= 1
 # undo must remain disabled in combat
 assert page.locator('#undo').is_disabled()
 print('Desktop browser smoke: PASS')
 mobile=browser.new_page(viewport={'width':390,'height':844},is_mobile=True,has_touch=True,device_scale_factor=1)
 mobile_errors=[]; mobile.on('pageerror',lambda error:mobile_errors.append(str(error)))
 mobile.set_content(markup,wait_until='domcontentloaded');mobile.wait_for_timeout(250)
 mobile_before = float(mobile.locator('#material').inner_text().split(' / ')[0])
 mobile.locator('[data-mode="turret"]').click();mobile.locator('#board').scroll_into_view_if_needed()
 rect=mobile.locator('#board').bounding_box();tx=rect['x']+rect['width']*(3.5/20);ty=rect['y']+rect['height']*(5.5/12)
 mobile.touchscreen.tap(tx,ty);mobile.wait_for_timeout(150)
 print('Mobile material:',mobile.locator('#material').inner_text(), 'errors',mobile_errors)
 assert 13 < mobile_before-float(mobile.locator('#material').inner_text().split(' / ')[0]) < 15,mobile.locator('#material').inner_text()
 mobile.screenshot(path=str(root / 'mobile.png'),full_page=True)
 assert not mobile_errors,mobile_errors
 print('Touch emulation smoke: PASS')
 browser.close()
