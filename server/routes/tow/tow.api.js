import axios from 'axios';
import fs from 'fs/promises';

export async function searchTow() {
  try {
    const today = new Date();
    const towDate = today.toISOString().split('T')[0];

    const data = await fs.readFile('Your plates document', 'utf-8');
    const plates = data.split('\n').map(line => line.trim()).filter(line => line !== '');

    const results = [];

    for (const plateVin of plates) {
      const response = await axios.post(
        'https://hrm.aimsparking.com/api/tows/index.php?cmd=search_tows',
        new URLSearchParams({
          plate_vin: plateVin,
          tow_date: towDate,
          formid: 'tow_search_form',
        }),
        {
          headers: {
            'Accept': '*/*',
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Origin': 'https://hrm.aimsparking.com',
            'Referer': 'https://hrm.aimsparking.com/tows/',
            'Sec-Ch-Ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
            'Sec-Ch-Ua-Mobile': '?1',
            'Sec-Ch-Ua-Platform': '"Android"',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36',
            'X-Requested-With': 'XMLHttpRequest',
            'X-Csrf-Token': 'NDIzOWI2OWYxZGFiNDIxNGYyMjIwODRiMmEyYzQ1Mjc1YjQ0OTBkOWY3NzZiOWE0YjQzY2YxMGJjNjJiMjg2ZQ==',
            'Cookie': 'AW9_BROWSERID=YzMxM2U1ODliMTY0ZjJlOTQ1OTQ1ZWNlODBkODk4MjNhNmJlNTJkOWQ0NWZkYmYxMDlmYmMzMjg5YjQyODFmZA%3D%3D; AW9_COOKIE_PARAMS=%7B%22cookie_path%22%3A%22%5C%2F%22%2C%22cookie_domain%22%3A%22hrm.aimsparking.com%22%2C%22secure%22%3Atrue%7D; cf_clearance=hZ8ZJc0H4nrNMe7i.QisvAP8F4RVcQnBnYTkDhgtIII-1745429644-1.2.1.1-tooQd5pdI_gkYy3UADTvY_dzcR573b4yRb04hkDw4vomPnvcg2MwzMvZrr674NoamyORvEfIXrVi0vXLJXLl2eil39RUbtIq5.OAKyblGTn4eTvzJqzx1jguAuZiPKyDdTdcsx7c.YSe_DH6r5dCfsYWYVB10W9sduu5JFcCTMe6v0dxbQ76pMGXs4HcnrOmLphr4uoFqGE102EgrIT.MouCG3zvDzdyu12DMazHCDiOrvULjcAKae4tOoQx5yB1JseSkhGrxu7QKePowTLBdX55wCD3qgmA9.yQbtM1E6asAhJrt_gSJKAM3GVg5lmepIUgPyzxwG5rB72JwwnVOcJKS8PsUOLcX5MfEmDgxiC4g9QGA4MjkwZ6nHixc2Sk; AW9_SESSIONID_2d527dbdbba6612e16e833c4aa2e4038=ODRkNDg1YTE0NGIyNzhlOTczMmFlMmFjYzJjYmI5MWZhNmZjMWM0ZWQwYWYwOGI4YTgyM2E5N2ExZTRmZmY0MQ%3D%3D; AW9_CSRF=YTk2NzA2MmMxNTkwM2Y2YWEyYzYxNWExYzgxYWY5NTBiMTExZGM5YmU3YTFiNzlmZTNmNTViNmM1MmRjZTI2ZA%3D%3D',
          },
        }
      );

      const postResult = response.data;

      // towId or not
      if (typeof postResult === 'string' && postResult.includes('#no_tows_found')) {
        continue;
      }

      // have towId
      const towidMatch = typeof postResult === 'string'
      ? postResult.match(/towid=(\d+)/)
      : null;
      
      if (towidMatch) {
        const towid = towidMatch[1];

        // use towId to get request
        const getResponse = await axios.get(`https://hrm.aimsparking.com/api/tows/index.php?cmd=get_tow_detail&towid=${towid}`, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': 'AW9_BROWSERID=YzMxM2U1ODliMTY0ZjJlOTQ1OTQ1ZWNlODBkODk4MjNhNmJlNTJkOWQ0NWZkYmYxMDlmYmMzMjg5YjQyODFmZA%3D%3D; AW9_COOKIE_PARAMS=%7B%22cookie_path%22%3A%22%5C%2F%22%2C%22cookie_domain%22%3A%22hrm.aimsparking.com%22%2C%22secure%22%3Atrue%7D; cf_clearance=hZ8ZJc0H4nrNMe7i.QisvAP8F4RVcQnBnYTkDhgtIII-1745429644-1.2.1.1-tooQd5pdI_gkYy3UADTvY_dzcR573b4yRb04hkDw4vomPnvcg2MwzMvZrr674NoamyORvEfIXrVi0vXLJXLl2eil39RUbtIq5.OAKyblGTn4eTvzJqzx1jguAuZiPKyDdTdcsx7c.YSe_DH6r5dCfsYWYVB10W9sduu5JFcCTMe6v0dxbQ76pMGXs4HcnrOmLphr4uoFqGE102EgrIT.MouCG3zvDzdyu12DMazHCDiOrvULjcAKae4tOoQx5yB1JseSkhGrxu7QKePowTLBdX55wCD3qgmA9.yQbtM1E6asAhJrt_gSJKAM3GVg5lmepIUgPyzxwG5rB72JwwnVOcJKS8PsUOLcX5MfEmDgxiC4g9QGA4MjkwZ6nHixc2Sk; AW9_SESSIONID_2d527dbdbba6612e16e833c4aa2e4038=ODRkNDg1YTE0NGIyNzhlOTczMmFlMmFjYzJjYmI5MWZhNmZjMWM0ZWQwYWYwOGI4YTgyM2E5N2ExZTRmZmY0MQ%3D%3D; AW9_CSRF=NDIzOWI2OWYxZGFiNDIxNGYyMjIwODRiMmEyYzQ1Mjc1YjQ0OTBkOWY3NzZiOWE0YjQzY2YxMGJjNjJiMjg2ZQ%3D%3D',
          },
        });

        results.push({
          plateVin,
          towid,
          towDetail: getResponse.data,
        });

        }else {
            continue;
        }
    } 

    return results;
  } catch (error) {
    throw error;
  }
}
