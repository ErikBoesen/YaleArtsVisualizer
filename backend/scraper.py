import requests
from bs4 import BeautifulSoup


cookies = {
}

headers = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/119.0',
    'Accept': 'application/json, text/javascript, */*; q=0.01',
    'Accept-Language': 'en-US,en;q=0.5',
    # 'Accept-Encoding': 'gzip, deflate, br',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    'X-Requested-With': 'XMLHttpRequest',
    'Origin': 'https://collegearts.yale.edu',
    'DNT': '1',
    'Connection': 'keep-alive',
    'Referer': 'https://collegearts.yale.edu/events/shows-screenings',
    # 'Cookie': '_ga=GA1.1.433751101.1663716810; ph_foZTeM1AW8dh5WkaofxTYiInBhS4XzTzRqLs50kVziw_posthog=%7B%22distinct_id%22%3A%22188f90065b6ae-0265a479d3cc8e8-41282c3d-1fa400-188f90065b7296%22%2C%22%24device_id%22%3A%22188f90065b6ae-0265a479d3cc8e8-41282c3d-1fa400-188f90065b7296%22%2C%22%24user_state%22%3A%22anonymous%22%2C%22extension_version%22%3A%221.5.5%22%2C%22%24sesid%22%3A%5B1687804817113%2C%22188f90066dc27-0321ee7d83ca408-41282c3d-1fa400-188f90066dd132b%22%2C1687804733148%5D%2C%22%24session_recording_enabled_server_side%22%3Afalse%2C%22%24autocapture_disabled_server_side%22%3Afalse%2C%22%24active_feature_flags%22%3A%5B%5D%2C%22%24enabled_feature_flags%22%3A%7B%22enable-session-recording%22%3Afalse%2C%22sourcing%22%3Afalse%2C%22only-company-edit%22%3Afalse%2C%22job-lists%22%3Afalse%7D%2C%22%24feature_flag_payloads%22%3A%7B%7D%7D; medicineyale_cookie_consent={"categories":["essential","analytics","advertising"],"level":["essential","analytics","advertising"],"revision":0,"data":null,"rfc_cookie":false,"consent_date":"2023-08-24T23:31:01.012Z","consent_uuid":"b11ce161-a9fa-4c5f-96a8-2e969393a9f7","last_consent_update":"2023-08-24T23:31:01.012Z"}; _ga_NF1213GXGY=GS1.1.1693342668.2.0.1693343115.0.0.0; nmstat=65cbe89b-5204-ec19-d6c2-b0ec1e104a52; mp_b6b4bb12-e8a3-48f7-a8ed-aa0be94fb272_perfalytics=%7B%22distinct_id%22%3A%20%2218a42d1869e233-0f1ceb05822149-41262c3d-13c680-18a42d1869f972%22%2C%22%24device_id%22%3A%20%2218a42d1869e233-0f1ceb05822149-41262c3d-13c680-18a42d1869f972%22%2C%22__last_event_time%22%3A%201693338144786%2C%22%24session_id%22%3A%20%2218a42d186a128d-04fd65a0a48e6e-41262c3d-13c680-18a42d186a28eb%22%2C%22__first_pageview_in_session_has_occurred%22%3A%20true%2C%22%24search_engine%22%3A%20%22google%22%2C%22__initial_utm_props_set%22%3A%20true%2C%22%24initial_referrer%22%3A%20%22https%3A%2F%2Fwww.google.com%2F%22%2C%22%24initial_referring_domain%22%3A%20%22www.google.com%22%2C%22%24pageview_id%22%3A%20%2218a42d186b150e-008d04c7d975fd8-41262c3d-13c680-18a42d186b2a6f%22%2C%22__first_pageview_occurred%22%3A%20true%2C%22__last_pageview_time%22%3A%201693338142390%7D; ajs_anonymous_id=%2218a42d1869e233-0f1ceb05822149-41262c3d-13c680-18a42d1869f972%22; _clck=1ximmnf|2|fek|0|1336; _ga_VVV4Q7EESL=GS1.1.1693406930.2.1.1693407078.0.0.0; _ga_Y57NC50W82=GS1.1.1693420232.4.0.1693420233.0.0.0; _ga_MNFPTCWVF5=GS1.1.1693421020.1.1.1693421093.0.0.0; _ga_G470VGEFDQ=GS1.1.1693428332.1.1.1693428354.0.0.0; _ga_D491W728G4=GS1.1.1693430558.1.0.1693430560.0.0.0; dtCookie=v_4_srv_3_sn_E988B03876F745D26BA4F3F419290657_perc_100000_ol_0_mul_1_app-3Ae3114a869ec8627c_0_app-3A09c378fd1d50f13a_1_app-3Aea7c4b59f27d43eb_0_app-3A1e70f254d6d57550_1_app-3A1ee3f0e5ac14ee67_1_app-3Abb88336c993cba2f_1_app-3A02c6a60722206870_1_app-3A7ccc62e318009b9e_1_app-3A897077b8b98a5ac3_1_rcs-3Acss_0; rxVisitor=1663802619762IN9KP3VVN73LAIRUH7LLF7M08VIO2JD8; dtPC=3$229818589_702h-vOHTQNLEGMNBTKFFQAUKWOGEMHTCRMRIL-0e0; rxvt=1693431618947|1693428354385; dtLatC=1; dtSa=-; adaptive_image=1920; has_js=1',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'Pragma': 'no-cache',
    'Cache-Control': 'no-cache',
    # Requests doesn't support trailers
    # 'TE': 'trailers',
}

data = {
    'page': '9',
    'view_name': 'shows_and_screenings',
    'view_display_id': 'block_1',
    'pager_element': '0',
}

response = requests.post('https://collegearts.yale.edu/views/ajax', cookies=cookies, headers=headers, data=data)
print(response.json()[2]['data'])

