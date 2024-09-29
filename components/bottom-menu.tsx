"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Home, DollarSign, Users, Wallet } from "lucide-react"
import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"

interface BottomMenuItemProps {
  icon: React.ReactNode
  label: string
  isActive: boolean
  onClick: () => void
  isDisabled?: boolean
  showTooltip?: boolean
  tooltipContent?: string
}

const BottomMenuItem: React.FC<BottomMenuItemProps> = ({ 
  icon, 
  label, 
  isActive, 
  onClick, 
  isDisabled,
  showTooltip,
  tooltipContent
}) => {
  const { toast } = useToast()

  const handleClick = () => {
    if (isDisabled) {
      toast({
        title: "Still cooking",
        description: "This feature is not available yet.",
        duration: 2000,
      })
    } else {
      onClick()
    }
  }

  const button = (
    <motion.button
      className={cn(
        "flex flex-col items-center justify-center p-2 rounded-lg",
        isActive ? "text-primary" : "text-muted-foreground",
        isDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-accent"
      )}
      whileTap={isDisabled ? {} : { scale: 0.95 }}
      onClick={handleClick}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </motion.button>
  )

  if (showTooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {button}
        </TooltipTrigger>
        <TooltipContent>
          <p>{tooltipContent}</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  return button
}

export function BottomMenuComponent() {
  const [activeTab, setActiveTab] = useState("Home")

  const menuItems = [
    { icon: <Home size={24} />, label: "Home" },
    { icon: <DollarSign size={24} />, label: "Earn" },
    { icon: <Users size={24} />, label: "Friends" },
    { 
      icon: <Wallet size={24} />, 
      label: "Wallet", 
      isDisabled: true,
      showTooltip: true,
      tooltipContent: "Still cooking"
    },
  ]

  return (
    <TooltipProvider>
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border">
        <nav className="flex justify-around items-center h-16">
          {menuItems.map((item) => (
            <BottomMenuItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              isActive={activeTab === item.label}
              onClick={() => !item.isDisabled && setActiveTab(item.label)}
              isDisabled={item.isDisabled}
              showTooltip={item.showTooltip}
              tooltipContent={item.tooltipContent}
            />
          ))}
        </nav>
      </div>
    </TooltipProvider>
  )
}