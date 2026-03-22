import { useEffect, useState } from "react"
import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { format } from "date-fns"
import { getHistoryById } from "@/services/history.service"
import { EasyriceNavbar } from "@/components/navbar"

interface CompositionResult {
    subStandardName: string;
    minLength: number;
    maxLength: number;
    conditionMin: string;
    conditionMax: string;
    weightGrams: number;
    percentage: number;
}

interface DefectResult {
    type: string;
    weightGrams: number;
    percentage: number;
}

interface InspectionData {
    name: string;
    createdDate?: string;
    inspectionID: string;
    standardName?: string;
    compositionResult?: CompositionResult[];
    defectResult?: DefectResult[];
    note?: string;
    totalSample?: string;
    samplingDate?: string;
    samplingPoints?: string[];
    price?: number;
}

export default function InspectionPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [data, setData] = useState<InspectionData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!id) return
        const fetchData = async () => {
            try {
                const result = await getHistoryById(id)
                setData(result)
            } catch (err) {
                console.error("Failed to fetch inspection:", err)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [id])

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "-"
        try {
            return format(new Date(dateStr), "dd/MM/yyyy - HH:mm:ss")
        } catch {
            return dateStr
        }
    }

    const formatLength = (comp: CompositionResult) => {
        const getOp = (cond: string) => {
            if (cond === 'LT') return '<';
            if (cond === 'LE') return '<=';
            if (cond === 'GT') return '>';
            if (cond === 'GE') return '>=';
            return '';
        };

        if (comp.maxLength === 99) {
            return `${getOp(comp.conditionMin)} ${comp.minLength}`;
        }
        if (comp.minLength || comp.maxLength) {
            let min = comp.minLength;
            let max = comp.maxLength;

            if (min && comp.conditionMin === 'GT') {
                min += 0.01
            }
            if (comp.conditionMax === 'LT') {
                max -= 0.01
            }

            return `${min} - ${max}`;
        }
        return "-";
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
            </div>
        )
    }

    if (!data) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-muted-foreground">Inspection not found.</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
            {/* Header */}
            <EasyriceNavbar />

            <header className="mb-10">
                <h1 className="text-[50px] font-semibold text-center text-slate-800 leading-[64px] tracking-[-0.004em]">Inspection</h1>
            </header>

            <main className="max-w-7xl mx-auto px-4 pb-10 grid grid-cols-1 md:grid-cols-12 gap-10">

                {/* Left Column: Image & Actions */}
                <div className="md:col-span-3">
                    <div className="bg-black overflow-hidden mb-6 shadow-lg aspect-[3/4] flex items-center justify-center group relative cursor-pointer border border-slate-200">
                        <img
                            src="/rice-sample.jpg"
                            alt="Rice Sample"
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://placehold.co/600x800/000000/FFFFFF?text=Rice+Sample'
                            }}
                        />
                    </div>
                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={() => navigate(`/history?${searchParams.toString()}`)}
                            className="w-[66px] h-[34px] flex items-center justify-center py-2 px-4 border border-slate-300 rounded-[6px] bg-white font-medium hover:bg-slate-50 transition active:scale-95 text-slate-700"
                        >
                            Back
                        </button>
                        <button
                            onClick={() => navigate(`/history/edit?id=${data.inspectionID}`)}
                            className="w-[66px] h-[34px] flex items-center justify-center py-2 px-4 bg-emerald-700 text-white rounded-[6px] font-medium hover:bg-emerald-800 transition shadow-sm active:scale-95"
                        >
                            Edit
                        </button>
                    </div>
                </div>

                {/* Right Column: Data Cards */}
                <div className="md:col-span-9 space-y-3 bg-[#7070701A] p-3 rounded-lg">

                    {/* Card 1: General Info */}
                    <div className="bg-white w-[928px] max-w-full h-[206px] p-4 rounded-[8px] shadow-sm border border-slate-100 grid grid-cols-2 gap-[12px] overflow-hidden">
                        <div className="space-y-1">
                            <p className="text-[#707070] text-[16px] font-medium leading-[20px] tracking-[-0.004em]">Create Date - Time</p>
                            <p className="text-[#000000DE] text-[18px] font-medium leading-[22px] tracking-[-0.004em]">{formatDate(data.createdDate)}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[#707070] text-[16px] font-medium leading-[20px] tracking-[-0.004em]">Inspection ID:</p>
                            <p className="text-[#000000DE] text-[18px] font-medium leading-[22px] tracking-[-0.004em]">{data.inspectionID}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[#707070] text-[16px] font-medium leading-[20px] tracking-[-0.004em]">Standard:</p>
                            <p className="text-[#000000DE] text-[18px] font-medium leading-[22px] tracking-[-0.004em]">{data.standardName || "-"}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[#707070] text-[16px] font-medium leading-[20px] tracking-[-0.004em]">Total Sample:</p>
                            <p className="text-[#000000DE] text-[18px] font-medium leading-[22px] tracking-[-0.004em]">{data.totalSample || "-"} kernal</p>
                        </div>
                        <div className="col-span-2 space-y-1">
                            <p className="text-[#707070] text-[16px] font-medium leading-[20px] tracking-[-0.004em]">Update Date - Time:</p>
                            <p className="text-[#000000DE] text-[18px] font-medium leading-[22px] tracking-[-0.004em]">{formatDate(data.createdDate)}</p>
                        </div>
                    </div>

                    {/* Card 2: Sampling Details */}
                    <div className="bg-white w-[928px] max-w-full h-[144px] p-4 rounded-[8px] shadow-sm border border-slate-100 grid grid-cols-2 gap-[12px] overflow-hidden">
                        <div className="space-y-1">
                            <p className="text-[#707070] text-[16px] font-medium leading-[20px] tracking-[-0.004em]">Note</p>
                            <p className="text-[#000000DE] text-[18px] font-medium leading-[22px] tracking-[-0.004em]">{data.note || "-"}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[#707070] text-[16px] font-medium leading-[20px] tracking-[-0.004em]">Price</p>
                            <p className="text-[#000000DE] text-[18px] font-medium leading-[22px] tracking-[-0.004em]">{data.price?.toLocaleString() || "0"}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[#707070] text-[16px] font-medium leading-[20px] tracking-[-0.004em]">Date/Time of Sampling</p>
                            <p className="text-[#000000DE] text-[18px] font-medium leading-[22px] tracking-[-0.004em]">{formatDate(data.samplingDate)}</p>
                        </div>
                        <div className="space-y-1">
                            <p className="text-[#707070] text-[16px] font-medium leading-[20px] tracking-[-0.004em]">Sampling Point</p>
                            <p className="text-[#000000DE] text-[18px] font-medium leading-[22px] tracking-[-0.004em]">
                                {data.samplingPoints && data.samplingPoints.length > 0
                                    ? [...data.samplingPoints]
                                        .map(p => p.toLowerCase().replace(/_/g, " ").replace(/\b\w/g, char => char.toUpperCase()))
                                        .sort((a, b) => {
                                            const order = ["Front End", "Back End", "Other"];
                                            return order.indexOf(a) - order.indexOf(b);
                                        })
                                        .join(", ")
                                    : "-"}
                            </p>
                        </div>
                    </div>

                    {/* Composition Result Container */}
                    <div className="bg-white w-[928px] max-w-full min-h-[222px] p-4 rounded-[8px] shadow-sm border border-slate-100 overflow-hidden">
                        <h3 className="text-2xl font-bold mb-6 text-slate-800">Composition</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-[#7070701A] text-[#000000DE] font-semibold text-[14px] leading-[18px] tracking-[-0.004em] h-[34px]">
                                        <th className="px-6 py-2 rounded-l-[4px] w-full">Name</th>
                                        <th className="px-4 py-2 text-left whitespace-nowrap">Length</th>
                                        <th className="pl-4 pr-[40px] py-2 text-left rounded-r-[4px] whitespace-nowrap">Actual</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {(data.compositionResult || []).map((comp, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 text-slate-700 font-medium">{comp.subStandardName}</td>
                                            {/* <td className="px-6 py-4 text-slate-500 font-medium font-mono text-sm text-right"> */}
                                            <td className="px-4 py-4 text-left text-slate-500 font-semibold text-[14px] leading-[18px] tracking-[-0.004em] whitespace-nowrap">
                                                {formatLength(comp)}
                                            </td>
                                            <td className="px-4 py-4 text-left text-emerald-600 font-semibold text-[14px] leading-[18px] tracking-[-0.004em] whitespace-nowrap pr-[40px]">
                                                {comp.percentage.toFixed(2)} %
                                            </td>
                                        </tr>
                                    ))}
                                    {(!data.compositionResult || data.compositionResult.length === 0) && (
                                        <tr>
                                            <td colSpan={3} className="px-6 py-12 text-center text-slate-400">No composition data</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Defect Rice Result section */}
                    <div className="bg-white w-[928px] max-w-full p-4 rounded-[8px] shadow-sm border border-slate-100 overflow-hidden">
                        <h3 className="text-2xl font-bold mb-6 text-slate-800">Defect Rice</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-[#7070701A] text-[#000000DE] font-semibold text-[14px] leading-[18px] tracking-[-0.004em] h-[34px]">
                                        <th className="px-6 py-2 rounded-l-[4px] w-full">Name</th>
                                        <th className="pl-4 pr-[40px] py-2 text-left rounded-r-[4px] whitespace-nowrap">Actual</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {(data.defectResult || []).map((defect, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 text-slate-700 font-medium capitalize">{defect.type}</td>
                                            <td className="px-4 py-4 text-left text-emerald-600 font-semibold text-[14px] leading-[18px] tracking-[-0.004em] whitespace-nowrap pr-[40px]">
                                                {defect.percentage.toFixed(2)} %
                                            </td>
                                        </tr>
                                    ))}
                                    {(!data.defectResult || data.defectResult.length === 0) && (
                                        <tr>
                                            <td colSpan={2} className="px-6 py-12 text-center text-slate-400">No defect data</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </main >
        </div >
    )
}