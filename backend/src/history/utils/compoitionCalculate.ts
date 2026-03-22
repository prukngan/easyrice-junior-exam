// ฟังก์ชัน Helper สำหรับตรวจสอบเงื่อนไขทางคณิตศาสตร์ 
const evaluateCondition = (value: number, limit: number, condition: string): boolean => {
    switch (condition) {
        case 'LT': return value < limit;
        case 'LE': return value <= limit;
        case 'GT': return value > limit;
        case 'GE': return value >= limit;
        default: return false;
    }
};

export const calculateCompositionResults = (
    grains: any[],
    selectedStandard: any,
) => {
    // 1. คำนวณน้ำหนักรวมของข้าวทั้งหมดในชุดข้อมูล [cite: 34]
    const totalWeight = grains.reduce((sum, grain) => sum + grain.weight, 0);

    // 2. Map ผ่าน subStandard แต่ละตัวใน Standard ที่เลือก [cite: 110-111]
    return selectedStandard.standardData.map((sub: any) => {

        // 3. กรองเมล็ดข้าวที่ตรงตามรูปร่างและความยาวที่กำหนด [cite: 171-172]
        const matchedGrains = grains.filter((grain) => {
            const allowedShapes = sub.shapes || sub.shape || [];
            const isShapeMatch = allowedShapes.includes(grain.shape);
            const isMinMatch = evaluateCondition(grain.length, sub.minLength, sub.conditionMin);
            const isMaxMatch = evaluateCondition(grain.length, sub.maxLength, sub.conditionMax);

            return isShapeMatch && isMinMatch && isMaxMatch;
        });

        // 4. รวมน้ำหนักของกลุ่มที่กรองได้
        const sumWeight = matchedGrains.reduce((sum, g) => sum + g.weight, 0);

        // 5. คำนวณเปอร์เซ็นต์ (ปัดเศษทศนิยม 2 ตำแหน่ง) 
        const percentage = totalWeight > 0 ? (sumWeight / totalWeight) * 100 : 0;

        // ส่งคืน Object ที่ตรงกับ Schema CompositionResult ของคุณ
        return {
            subStandardKey: sub.key,
            subStandardName: sub.name,
            minLength: sub.minLength,
            maxLength: sub.maxLength,
            conditionMin: sub.conditionMin,
            conditionMax: sub.conditionMax,
            weightGrams: Number(sumWeight.toFixed(4)),
            percentage: Number(percentage.toFixed(4)),
        };
    });
};