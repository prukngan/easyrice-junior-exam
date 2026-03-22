import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { EasyriceNavbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from "@/components/date-picker";
import { getHistoryById, updateHistory } from "@/services/history.service";
import { extractErrorMessage } from "@/services/utils/extractErrorMsg";

const SAMPLING_POINTS = [
    { id: "frontend", label: "Front End" },
    { id: "backend", label: "Back End" },
    { id: "other", label: "Other" }
];

export default function EditInspectionPage() {
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        note: "",
        price: "" as string | number,
        samplingAt: new Date(),
        samplingPoints: [] as string[],
    });

    useEffect(() => {
        if (!id) {
            setError("No inspection ID provided.");
            setLoading(false);
            return;
        }

        async function loadData() {
            try {
                setLoading(true);
                const data = await getHistoryById(id!);

                setFormData({
                    note: data.note || "",
                    price: data.price !== undefined && data.price !== null ? data.price : "",
                    samplingAt: data.samplingDate ? new Date(data.samplingDate) : new Date(),
                    samplingPoints: data.samplingPoints || [],
                });
            } catch (err) {
                console.error("Failed to load inspection data", err);
                setError("Failed to load inspection record.");
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, [id]);

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
        if (!id) return;

        setSubmitting(true);
        setError(null);

        try {
            await updateHistory(id, {
                note: formData.note,
                price: formData.price !== "" ? Number(formData.price) : undefined,
                samplingDate: formData.samplingAt.toISOString(),
                samplingPoints: formData.samplingPoints,
            });
            navigate(`/history/${id}`);
        } catch (err) {
            console.error("Failed to update inspection", err);
            setError(extractErrorMessage(err));
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8F9FA]">
                <EasyriceNavbar />
                <div className="flex items-center justify-center min-h-[50vh]">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-700 border-t-transparent" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F9FA] font-sans pb-12">
            <EasyriceNavbar />
            {/* <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-[90px] pb-6 pt-0 flex flex-col items-center"> */}

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-[90px] pb-6 pt-0 flex flex-col items-center">
                <h1 className="text-[32px] font-bold text-center text-slate-900 mb-8">
                    Edit Inspection ID : {id}
                </h1>

                {/* Card */}
                <div className="bg-white w-full max-w-[500px] p-8 rounded-xl shadow-[0px_8px_108px_0px_rgba(0,0,0,0.06)] border border-slate-100">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Note */}
                        <div className="flex flex-col gap-2">
                            <label htmlFor="note" className="text-slate-800 text-[15px] font-semibold">
                                Note
                            </label>
                            <Input
                                id="note"
                                placeholder="Inspection Support"
                                value={formData.note}
                                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                className="h-[44px] border-slate-300 rounded-md focus-visible:border-emerald-600 focus-visible:ring-0 outline-none transition-all"
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
                                placeholder="15,000"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="h-[44px] border-slate-300 rounded-md focus-visible:border-emerald-600 focus-visible:ring-0 outline-none transition-all"
                            />
                        </div>

                        {/* Sampling Point */}
                        <div className="flex flex-col gap-2">
                            <label className="text-slate-800 text-[15px] font-semibold">
                                Sampling Point
                            </label>
                            <div className="flex items-center justify-between pt-1">
                                {SAMPLING_POINTS.map((item) => (
                                    <div key={item.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={item.id}
                                            checked={formData.samplingPoints.includes(item.label) || formData.samplingPoints.includes(item.label.toUpperCase().replace(' ', '_'))}
                                            onCheckedChange={(checked) => handleCheckboxChange(item.label, !!checked)}
                                            className="h-5 w-5 border-slate-300 data-[state=checked]:bg-emerald-700 data-[state=checked]:border-emerald-700 rounded-[4px]"
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
                                className="h-[44px] border-slate-300 rounded-md"
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded text-red-600 text-sm font-medium">
                                {error}
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => navigate(-1)}
                                className="w-[84px] h-[34px] border-[#166534] text-[#166534] hover:bg-emerald-50 rounded-[6px] font-semibold"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={submitting}
                                className="w-[84px] h-[34px] bg-[#166534] hover:bg-[#155e2f] text-white rounded-[6px] font-semibold shadow-sm transition-colors"
                            >
                                {submitting ? "..." : "Submit"}
                            </Button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
