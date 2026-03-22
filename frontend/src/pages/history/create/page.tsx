import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EasyriceNavbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/date-picker";
import { getStandards, createHistory } from "@/services/history.service";
import type { Standard } from "@/types/history";
import { ChevronDown } from "lucide-react";

export default function CreateInspectionPage() {
    const navigate = useNavigate();
    const [standards, setStandards] = useState<Standard[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: "",
        standardID: "",
        note: "",
        price: "",
        samplingAt: new Date(),
        samplingPoints: [] as string[],
        rawData: null as File | null,
    });

    useEffect(() => {
        async function loadStandards() {
            try {
                const res = await getStandards();
                setStandards(res.data);
            } catch (err) {
                console.error("Failed to load standards", err);
            }
        }
        loadStandards();
    }, []);

    const handleCheckboxChange = (point: string, checked: boolean) => {
        setFormData((prev) => {
            const newPoints = checked
                ? [...prev.samplingPoints, point]
                : prev.samplingPoints.filter((p) => p !== point);
            return { ...prev, samplingPoints: newPoints };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.standardID) {
            setError("Please fill in all required fields (Name and Standard).");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await createHistory({
                name: formData.name,
                standardID: formData.standardID,
                note: formData.note,
                price: formData.price ? Number(formData.price) : undefined,
                samplingAt: formData.samplingAt.toISOString(),
                samplingPoints: formData.samplingPoints,
                rawData: formData.rawData || undefined,
            });
            navigate("/history");
        } catch (err: any) {
            console.error("Failed to create inspection", err);
            setError(err.message || "Failed to create inspection record.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] font-sans">
            <EasyriceNavbar />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-[90px] pb-6 pt-0 flex flex-col items-center">

                <h1 className="text-[48px] font-bold text-center text-slate-900 mb-12">
                    Create Inspection
                </h1>

                {/* Main Card Container */}
                <div className="bg-white w-full max-w-[560px] p-8 rounded-xl shadow-sm border border-slate-100">
                    <form onSubmit={handleSubmit} className="space-y-5">

                        {/* Name */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="name" className="text-slate-800 text-[15px] font-semibold">
                                Name*
                            </label>
                            <Input
                                id="name"
                                placeholder="Please Holder"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full h-[44px] border-slate-300 rounded-md focus-visible:border-emerald-600 focus-visible:ring-0 outline-none transition-all placeholder:text-slate-400"
                            />
                        </div>

                        {/* Standard */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="standard" className="text-slate-800 text-[15px] font-semibold">
                                Standard*
                            </label>
                            <div className="relative">
                                <select
                                    id="standard"
                                    value={formData.standardID}
                                    onChange={(e) => setFormData({ ...formData, standardID: e.target.value })}
                                    className="w-full h-[44px] px-3 py-2 bg-white border border-slate-300 rounded-md text-sm text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 appearance-none cursor-pointer"
                                >
                                    <option value="" disabled>Please Select Standard</option>
                                    {standards.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.standardName}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-slate-500">
                                    <ChevronDown className="h-4 w-4" />
                                </div>
                            </div>
                        </div>

                        {/* Upload File - Custom UI look */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="file" className="text-slate-800 text-[15px] font-semibold">
                                Upload File
                            </label>
                            <Input
                                id="file"
                                type="file"
                                onChange={(e) => setFormData({ ...formData, rawData: e.target.files?.[0] || null })}
                                className="w-full h-[44px] border-slate-300 rounded-md file:mr-4 file:h-full file:px-4 file:rounded-none file:border-0 file:text-sm file:bg-slate-100 hover:file:bg-slate-200 cursor-pointer flex items-center p-0 overflow-hidden"
                            />
                        </div>

                        {/* Note */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="note" className="text-slate-800 text-[15px] font-semibold">
                                Note
                            </label>
                            <Input
                                id="note"
                                placeholder="Please Holder"
                                value={formData.note}
                                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                className="w-full h-[44px] border-slate-300 rounded-md focus-visible:border-emerald-600 focus-visible:ring-0 outline-none transition-all"
                            />
                        </div>

                        {/* Price */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="price" className="text-slate-800 text-[15px] font-semibold">
                                Price
                            </label>
                            <Input
                                id="price"
                                type="number"
                                placeholder="10,000"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full h-[44px] border-slate-300 rounded-md focus-visible:border-emerald-600 focus-visible:ring-0 outline-none transition-all"
                            />
                        </div>

                        {/* Sampling Point */}
                        <div className="flex flex-col gap-2">
                            <label className="text-slate-800 text-[15px] font-semibold">
                                Sampling Point
                            </label>
                            <div className="flex items-center justify-between w-[416px] h-[42px] px-2">
                                {[
                                    { id: "frontend", label: "Front End" },
                                    { id: "backend", label: "Back End" },
                                    { id: "other", label: "Other" }
                                ].map((item) => (
                                    <div key={item.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={item.id}
                                            checked={formData.samplingPoints.includes(item.label)}
                                            onCheckedChange={(checked) => handleCheckboxChange(item.label, !!checked)}
                                            className="border-slate-300 data-[state=checked]:bg-emerald-700 data-[state=checked]:border-emerald-700"
                                        />
                                        <label htmlFor={item.id} className="text-sm font-medium text-slate-700 cursor-pointer">
                                            {item.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Date/Time */}
                        <div className="flex flex-col gap-2">
                            <label className="text-slate-800 text-[15px] font-semibold">
                                Date/Time of Sampling
                            </label>
                            <DatePicker
                                date={formData.samplingAt}
                                showTime={true}
                                onSelect={(date) => date && setFormData({ ...formData, samplingAt: date })}
                                className="w-full h-[44px] border-slate-300"
                            />
                        </div>

                        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                        {/* Action Buttons */}
                        <div className="flex justify-end gap-[10px] pt-1">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate(-1)}
                                className="w-[79px] h-[34px] px-4 py-2 border border-emerald-700 text-emerald-700 hover:bg-emerald-50 font-semibold rounded-[6px]"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-[79px] h-[34px] px-4 py-2 bg-[#166534] hover:bg-[#14532D] text-white font-semibold rounded-[6px] shadow-sm transition-colors"
                            >
                                {loading ? "Subm..." : "Submit"}
                            </Button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}