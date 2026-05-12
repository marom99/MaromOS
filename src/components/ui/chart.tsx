import * as React from "react"
import { Tooltip as RechartsTooltip } from "recharts"
import { cn } from "@/lib/utils"

export type ChartConfig = Record<
  string,
  { label: string; color?: string }
>

type ChartContextValue = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextValue | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)
  if (!context) {
    throw new Error("useChart must be used within a <ChartContainer />")
  }
  return context
}

export { RechartsTooltip as ChartTooltip }

interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  config: ChartConfig
}

const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ config, children, className, style, ...props }, ref) => {
    const cssVars = React.useMemo(() => {
      return Object.entries(config).reduce<Record<string, string>>(
        (acc, [key, item]) => {
          if (item.color) {
            acc[`--color-${key}`] = item.color
          }
          return acc
        },
        {}
      )
    }, [config])

    return (
      <ChartContext.Provider value={{ config }}>
        <div
          ref={ref}
          className={cn("h-full w-full", className)}
          style={{ ...cssVars, ...style }}
          {...props}
        >
          {children}
        </div>
      </ChartContext.Provider>
    )
  }
)
ChartContainer.displayName = "ChartContainer"

type ChartTooltipContentProps = React.HTMLAttributes<HTMLDivElement> & {
  hideLabel?: boolean
  active?: boolean
  payload?: Array<{
    name: string
    value: number
    payload: Record<string, unknown>
  }>
  label?: string
}

const ChartTooltipContent = React.forwardRef<HTMLDivElement, ChartTooltipContentProps>(
  ({ active, payload, label, hideLabel, className, ...props }, ref) => {
    const { config } = useChart()

    if (!active || !payload?.length) {
      return null
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border bg-background px-2.5 py-1.5 text-xs shadow-md",
          className
        )}
        {...props}
      >
        {!hideLabel && label && (
          <div className="mb-0.5 font-medium text-muted-foreground">{label}</div>
        )}
        <div className="flex flex-col gap-0.5">
          {payload.map((item) => {
            const cfg = config[item.name]
            const color = cfg?.color ?? `var(--color-${item.name})`
            return (
              <div key={item.name} className="flex items-center gap-1.5">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: color }}
                />
                <span className="font-medium tabular-nums">{item.value}</span>
                {cfg?.label && !hideLabel && (
                  <span className="text-muted-foreground">{cfg.label}</span>
                )}
              </div>
            )
          })}
        </div>
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltipContent"

export { ChartContainer, ChartTooltipContent }
