"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Section } from "@/components/section"
import { Container } from "@/components/container"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Download, Share2, AlertCircle } from "lucide-react"

interface ChartData {
  year: number
  compound: number
  nonCompound: number
  contribution: number
}

const MIN_CONTRIBUTION = 500000

export function CompoundCalculator() {
  const [principal, setPrincipal] = useState(1000000)
  const [monthlyContribution, setMonthlyContribution] = useState(500000)
  const [rate, setRate] = useState(7)
  const [years, setYears] = useState(20)
  const [showContributions, setShowContributions] = useState(true)
  const [contributionError, setContributionError] = useState("")
  const [showTable, setShowTable] = useState(false)

  const formatYAxisLabel = (value: number) => {
    if (value >= 1000000) {
      return `${Math.round(value / 1000000)}M`
    }
    if (value >= 1000) {
      return `${Math.round(value / 1000)}K`
    }
    return value.toLocaleString("id-ID")
  }

  const chartData = useMemo(() => {
    const data: ChartData[] = []
    const monthlyRate = rate / 100 / 12
    let balance = principal

    for (let year = 0; year <= years; year++) {
      let yearBalance = balance

      // Compound monthly for the year
      for (let month = 0; month < 12; month++) {
        yearBalance = yearBalance * (1 + monthlyRate) + monthlyContribution
      }

      const totalInvested = principal + monthlyContribution * 12 * year
      const nonCompound = totalInvested + principal * (rate / 100) * year

      data.push({
        year,
        compound: yearBalance,
        nonCompound,
        contribution: totalInvested,
      })

      balance = yearBalance
    }

    return data
  }, [principal, monthlyContribution, rate, years])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value)
  }

  const handleMonthlyContributionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value)
    setMonthlyContribution(value)

    if (value < MIN_CONTRIBUTION) {
      setContributionError(`Minimum contribution is ${formatCurrency(MIN_CONTRIBUTION)}`)
    } else {
      setContributionError("")
    }
  }

  const finalData = chartData[chartData.length - 1]
  const finalCompound = finalData?.compound || 0
  const finalNonCompound = finalData?.nonCompound || 0
  const totalInvested = principal + monthlyContribution * 12 * years
  const totalEarnings = finalCompound - totalInvested

  const handleExportCSV = () => {
    const csv = [
      ["Year", "Total Balance", "Total Invested", "Earnings"],
      ...chartData.map((d) => [
        d.year,
        Math.round(d.compound),
        Math.round(principal + monthlyContribution * 12 * d.year),
        Math.round(d.compound - (principal + monthlyContribution * 12 * d.year)),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "compound-interest-idr.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleShare = () => {
    const params = new URLSearchParams({
      principal: principal.toString(),
      monthly: monthlyContribution.toString(),
      rate: rate.toString(),
      years: years.toString(),
    })
    const url = `${window.location.origin}/features?calc=${params.toString()}`
    navigator.clipboard.writeText(url)
    alert("Tautan perhitungan disalin ke papan klip!")
  }

  return (
    <Section id="calculator" className="bg-muted/30">
      <Container>
        <div className="mb-12">
          <h2 className="text-balance mb-4">Kalkulator Bunga Majemuk</h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Visualisasikan kekuatan bunga majemuk dengan kontribusi bulanan bebas, pemformatan rupiah Indonesia, dan
            rincian tahunan yang detail.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="space-y-6">
            {/* Principal */}
            <div>
              <Label htmlFor="principal" className="text-sm font-medium">
                Modal Awal: {formatCurrency(principal)}
              </Label>
              <Input
                id="principal"
                type="range"
                min="500000"
                max="50000000"
                step="500000"
                value={principal}
                onChange={(e) => setPrincipal(Number(e.target.value))}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-2">
                {formatCurrency(500000)} - {formatCurrency(50000000)}
              </p>
            </div>

            <div>
              <Label htmlFor="monthly" className="text-sm font-medium">
                Kontribusi Bulanan: {formatCurrency(monthlyContribution)}
              </Label>
              <Input
                id="monthly"
                type="number"
                min={MIN_CONTRIBUTION}
                step="100000"
                value={monthlyContribution}
                onChange={handleMonthlyContributionChange}
                className={`mt-2 ${contributionError ? "border-destructive" : ""}`}
              />
              {contributionError ? (
                <div className="flex items-center gap-2 mt-2 text-destructive text-xs">
                  <AlertCircle size={14} />
                  <span>{contributionError}</span>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground mt-2">Minimum: {formatCurrency(MIN_CONTRIBUTION)}</p>
              )}
            </div>

            {/* Rate */}
            <div>
              <Label htmlFor="rate" className="text-sm font-medium">
                Suku Bunga Tahunan: {rate.toFixed(1)}%
              </Label>
              <Input
                id="rate"
                type="range"
                min="0.5"
                max="20"
                step="0.5"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-2">0.5% - 20%</p>
            </div>

            {/* Time Period */}
            <div>
              <Label htmlFor="years" className="text-sm font-medium">
                Periode Waktu: {years} tahun
              </Label>
              <Input
                id="years"
                type="range"
                min="1"
                max="50"
                step="1"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-2">1 - 50 tahun</p>
            </div>

            {/* Toggle Contributions */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showContributions}
                onChange={(e) => setShowContributions(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm font-medium">Tampilkan Garis Kontribusi</span>
            </label>

            <div className="pt-4 space-y-4 border-t border-border">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Saldo Akhir (Majemuk)</p>
                <p className="text-2xl font-bold text-primary">{formatCurrency(finalCompound)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Total Modal Tertanam</p>
                <p className="text-lg font-semibold">{formatCurrency(totalInvested)}</p>
              </div>
              <div className="bg-accent/10 p-3 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Keuntungan Bunga</p>
                <p className="text-xl font-semibold text-accent">{formatCurrency(totalEarnings)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Saldo Tanpa Majemuk</p>
                <p className="text-lg font-semibold text-muted-foreground">{formatCurrency(finalNonCompound)}</p>
              </div>
            </div>

            {/* Export & Share */}
            <div className="flex gap-2 pt-4">
              <Button size="sm" variant="outline" onClick={handleExportCSV} className="flex-1 bg-transparent">
                <Download size={16} className="mr-2" /> CSV
              </Button>
              <Button size="sm" variant="outline" onClick={handleShare} className="flex-1 bg-transparent">
                <Share2 size={16} className="mr-2" /> Bagikan
              </Button>
            </div>
          </div>

          {/* Charts */}
          <div className="md:col-span-2 space-y-6">
            {/* Line Chart */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Pertumbuhan Seiring Waktu</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="year" stroke="var(--muted-foreground)" style={{ fontSize: "12px" }} />
                  <YAxis
                    stroke="var(--muted-foreground)"
                    style={{ fontSize: "12px" }}
                    tickFormatter={formatYAxisLabel}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      color: "var(--foreground)",
                    }}
                    formatter={(value) => formatCurrency(value as number)}
                  />
                  <Legend wrapperStyle={{ color: "var(--muted-foreground)", fontSize: "12px" }} />
                  <Line
                    type="monotone"
                    dataKey="compound"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    dot={false}
                    name="Pertumbuhan Majemuk"
                  />
                  {showContributions && (
                    <Line
                      type="monotone"
                      dataKey="contribution"
                      stroke="var(--accent)"
                      strokeWidth={2}
                      dot={false}
                      name="Total Kontribusi"
                      strokeDasharray="5 5"
                    />
                  )}
                  <Line
                    type="monotone"
                    dataKey="nonCompound"
                    stroke="var(--muted-foreground)"
                    strokeWidth={2}
                    dot={false}
                    name="Pertumbuhan Tanpa Majemuk"
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Bar Chart - Annual Breakdown */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Rincian Tahunan</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart
                  data={chartData.filter((_, i) => i % Math.ceil(years / 5) === 0 || i === chartData.length - 1)}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="year" stroke="var(--muted-foreground)" style={{ fontSize: "12px" }} />
                  <YAxis
                    stroke="var(--muted-foreground)"
                    style={{ fontSize: "12px" }}
                    tickFormatter={formatYAxisLabel}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: "1px solid var(--border)",
                      borderRadius: "8px",
                      color: "var(--foreground)",
                    }}
                    formatter={(value) => formatCurrency(value as number)}
                  />
                  <Legend wrapperStyle={{ color: "var(--muted-foreground)", fontSize: "12px" }} />
                  <Bar dataKey="compound" fill="var(--primary)" name="Nilai Majemuk" />
                  <Bar dataKey="nonCompound" fill="var(--muted-foreground)" name="Nilai Tanpa Majemuk" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Tabel Rincian Lengkap</h3>
                <Button size="sm" variant="outline" onClick={() => setShowTable(!showTable)} className="bg-transparent">
                  {showTable ? "Sembunyikan" : "Tampilkan"}
                </Button>
              </div>

              {showTable && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 px-2 text-muted-foreground font-medium">Tahun</th>
                        <th className="text-right py-2 px-2 text-muted-foreground font-medium">Total Kontribusi</th>
                        <th className="text-right py-2 px-2 text-muted-foreground font-medium">Nilai Majemuk</th>
                        <th className="text-right py-2 px-2 text-muted-foreground font-medium">Keuntungan</th>
                      </tr>
                    </thead>
                    <tbody>
                      {chartData.map((row) => {
                        const earnings = row.compound - row.contribution
                        return (
                          <tr key={row.year} className="border-b border-border hover:bg-muted/50 transition-colors">
                            <td className="py-2 px-2 text-foreground font-medium">{row.year}</td>
                            <td className="text-right py-2 px-2 text-muted-foreground">
                              {formatCurrency(row.contribution)}
                            </td>
                            <td className="text-right py-2 px-2 font-semibold text-primary">
                              {formatCurrency(row.compound)}
                            </td>
                            <td className="text-right py-2 px-2 font-semibold text-accent">
                              {formatCurrency(earnings)}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
