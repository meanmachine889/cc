import type React from "react"
import { Card, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { BrainCircuit, LineChart, Droplet } from "lucide-react"
import type { ReactNode } from "react"

export default function Feature() {
  return (
    <section className="bg-zinc-50 dark:bg-black w-full px-4 sm:px-8 md:px-14">
      <p className="text-xl sm:text-2xl md:text-3xl mb-6 sm:mb-8 md:mb-9">What Sets Us Apart</p>
      <div>
        <div className="mx-auto grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {/* AI Onboarding */}
          <FeatureCard>
            <CardHeader className="pb-3">
              <CardHeading
                icon={BrainCircuit}
                title="AI Onboarding"
                description="Converts KYC + setup into 2-minute experience."
                c="pink"
              />
            </CardHeader>
          </FeatureCard>

          {/* Bonding Curve Pricing */}
          <FeatureCard>
            <CardHeader className="pb-3">
              <CardHeading
                icon={LineChart}
                title="Bonding Curve Pricing"
                description="Transparent, automated, fair credit distribution."
                c="green"
              />
            </CardHeader>
          </FeatureCard>

          {/* DAMM-Powered Vault */}
          <FeatureCard>
            <CardHeader className="pb-3">
              <CardHeading
                icon={Droplet}
                title="DAMM-Powered Vault"
                description="Converts idle bonds into active climate capital."
                c="blue"
              />
            </CardHeader>
          </FeatureCard>
        </div>
      </div>
    </section>
  )
}

interface FeatureCardProps {
  children: ReactNode
  className?: string
}

const FeatureCard = ({ children, className }: FeatureCardProps) => (
  <Card className={cn("group relative bg-black rounded-none shadow-zinc-950/5 p-4 sm:p-5 md:p-6", className)}>
    <CardDecorator />
    {children}
  </Card>
)

const CardDecorator = () => (
  <>
    <span className="border-primary absolute -left-px -top-px block size-2 border-l-2 border-t-2"></span>
    <span className="border-primary absolute -right-px -top-px block size-2 border-r-2 border-t-2"></span>
    <span className="border-primary absolute -bottom-px -left-px block size-2 border-b-2 border-l-2"></span>
    <span className="border-primary absolute -bottom-px -right-px block size-2 border-b-2 border-r-2"></span>
  </>
)

interface CardHeadingProps {
  icon: React.ElementType
  title: string
  description: string
  c: string
}

const CardHeading = ({ icon: Icon, title, description, c }: CardHeadingProps) => {
  const getIconColorClass = (color: string) => {
    switch (color) {
      case "pink":
        return "text-pink-500"
      case "green":
        return "text-green-500"
      case "blue":
        return "text-blue-500"
      default:
        return "text-primary"
    }
  }

  return (
    <div className="flex flex-col gap-3 py-2 group">
      <div className="flex flex-col items-start gap-5">
        <div className="rounded-md flex items-center justify-center border-zinc-700 border bg-gradient-to-b from-[#1a1a1a] to-black p-2 sm:p-3">
          <Icon className={`size-5 ${getIconColorClass(c)}`} />
        </div>
        <h3 className="text-lg sm:text-xl md:text-xl mt-8 sm:mt-10 md:mt-12">{title}</h3>
      </div>
      <p className="text-muted-foreground text-base sm:text-lg md:text-lg mt-3 sm:mt-4 md:mt-4 leading-relaxed">
        {description}
      </p>
    </div>
  )
}
