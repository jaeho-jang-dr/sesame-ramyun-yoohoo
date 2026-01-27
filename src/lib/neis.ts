const BASE_URL = 'https://open.neis.go.kr/hub';

export interface SchoolInfo {
    ATPT_OFCDC_SC_CODE: string; // 시도교육청코드
    SD_SCHUL_CODE: string;      // 표준학교코드
    SCHUL_NM: string;           // 학교명
}

export interface MealInfo {
    MLSV_YMD: string;       // 급식일자
    DDISH_NM: string;       // 요리명 (html 태그 포함됨)
    CAL_INFO: string;       // 칼로리정보
    NTR_INFO: string;       // 영양정보
}

interface NeisSchoolRow {
    ATPT_OFCDC_SC_CODE: string;
    SD_SCHUL_CODE: string;
    SCHUL_NM: string;
    // other fields omitted
}

// 학교 검색
export async function searchSchool(schoolName: string): Promise<SchoolInfo[]> {
    try {
        const response = await fetch(`${BASE_URL}/schoolInfo?Type=json&SCHUL_NM=${encodeURIComponent(schoolName)}`);
        const data = await response.json();

        if (data.schoolInfo) {
            return data.schoolInfo[1].row.map((row: NeisSchoolRow) => ({
                ATPT_OFCDC_SC_CODE: row.ATPT_OFCDC_SC_CODE,
                SD_SCHUL_CODE: row.SD_SCHUL_CODE,
                SCHUL_NM: row.SCHUL_NM
            }));
        }
        return [];
    } catch (error) {
        console.error("School search error:", error);
        return [];
    }
}

// 급식 조회
export async function getMeals(officeCode: string, schoolCode: string, date: string): Promise<MealInfo | null> {
    try {
        // date format: YYYYMMDD
        const ymd = date.replace(/-/g, '');
        const url = `${BASE_URL}/mealServiceDietInfo?Type=json&ATPT_OFCDC_SC_CODE=${officeCode}&SD_SCHUL_CODE=${schoolCode}&MLSV_YMD=${ymd}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.mealServiceDietInfo) {
            const row = data.mealServiceDietInfo[1].row[0];
            return {
                MLSV_YMD: row.MLSV_YMD,
                DDISH_NM: row.DDISH_NM.replace(/<br\/>/g, '\n'), // 줄바꿈 치환
                CAL_INFO: row.CAL_INFO,
                NTR_INFO: row.NTR_INFO
            };
        }
        return null;
    } catch (error) {
        console.error("Meal fetch error:", error);
        return null;
    }
}
