/**
 * คำนวณผลลัพธ์ Defect (type-based classification)
 * จัดกลุ่มเมล็ดข้าวตาม type แล้วคำนวณเปอร์เซ็นต์น้ำหนักของแต่ละประเภท
 * รวมถึง "total" ที่รวมทุก type ที่ไม่ใช่ white
 *
 * ใช้การ derive type จาก data จริงโดย filter 'white' ออก
 * เพื่อรองรับ type ที่ไม่ได้ระบุในโจทย์ (เช่น 'undermilled')
 * และไม่สร้าง row ที่ weight = 0 สำหรับ type ที่ไม่มีในข้อมูล
 */
export const calculateDefectResults = (grains: any[]) => {
    // 1. คำนวณน้ำหนักรวมของข้าวทั้งหมด
    const totalWeight = grains.reduce((sum: number, grain: any) => sum + grain.weight, 0);

    // 2. Derive defect types จาก data จริง (ทุก type ยกเว้น 'white')
    //    - ครอบคลุม 'undermilled' และ type อื่นๆ ที่อาจมีในอนาคต
    //    - ไม่สร้าง row ที่ไม่มีข้อมูลจริง (เช่น 'red', 'damage', 'paddy' ถ้าไม่มีใน data)
    const defectTypes = [...new Set(grains.map((g: any) => g.type as string))]
        .filter((type) => type !== 'white')
        .sort(); // sort เพื่อให้ผลลัพธ์เรียงลำดับสม่ำเสมอ

    // 3. คำนวณน้ำหนักและเปอร์เซ็นต์ของแต่ละ defect type
    const percentageEachType = defectTypes.map((type) => {
        const matchedGrains = grains.filter((grain: any) => grain.type === type);
        const sumWeight = matchedGrains.reduce((sum: number, g: any) => sum + g.weight, 0);
        const percentage = totalWeight > 0 ? (sumWeight / totalWeight) * 100 : 0;

        return {
            type,
            weightGrams: Number(sumWeight.toFixed(4)),
            percentage: Number(percentage.toFixed(4)),
        };
    });

    // 4. คำนวณ "total" = ผลรวมของทุก type ที่ไม่ใช่ white
    const totalDefectWeight = grains
        .filter((grain: any) => grain.type !== 'white')
        .reduce((sum: number, g: any) => sum + g.weight, 0);
    const totalPercentage = totalWeight > 0 ? (totalDefectWeight / totalWeight) * 100 : 0;

    return {
        percentageEachType,
        totalWeight,
        totalDefectWeight,
        totalPercentage
    };
};
