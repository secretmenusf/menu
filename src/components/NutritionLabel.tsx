"use client";

import * as React from "react";
import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Flame,
  Leaf,
  AlertTriangle,
  Heart,
  Info,
  Wheat,
  Droplets,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { nutritionLabels, type NutritionLabel as NutritionLabelType } from "@/data/nutritionLabels";

interface NutritionLabelProps {
  dishName: string;
  compact?: boolean;
  className?: string;
}

// Dietary tag display config
const dietaryTags: Record<string, { label: string; color: string }> = {
  GF: { label: "Gluten-Free", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  DF: { label: "Dairy-Free", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  V: { label: "Vegetarian", color: "bg-green-500/20 text-green-400 border-green-500/30" },
  VG: { label: "Vegan", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" },
  Organic: { label: "Organic", color: "bg-lime-500/20 text-lime-400 border-lime-500/30" },
  "Non-GMO": { label: "Non-GMO", color: "bg-teal-500/20 text-teal-400 border-teal-500/30" },
  Keto: { label: "Keto", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" },
  Paleo: { label: "Paleo", color: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
};

// Nutrition bar component
function NutritionBar({
  label,
  value,
  unit,
  max,
  color = "bg-amber-500",
  icon: Icon,
}: {
  label: string;
  value: number;
  unit: string;
  max: number;
  color?: string;
  icon?: React.ElementType;
}) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center gap-1.5 text-zinc-400">
          {Icon && <Icon className="h-3.5 w-3.5" />}
          {label}
        </span>
        <span className="font-medium text-zinc-200">
          {value}
          {unit}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
        <div
          className={cn("h-full rounded-full transition-all duration-500", color)}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// Health score indicator
function HealthScoreIndicator({ score }: { score: number }) {
  const getScoreColor = (s: number) => {
    if (s >= 8) return "text-emerald-400";
    if (s >= 6) return "text-amber-400";
    if (s >= 4) return "text-orange-400";
    return "text-red-400";
  };

  const getBarColor = (s: number) => {
    if (s >= 8) return "bg-emerald-500";
    if (s >= 6) return "bg-amber-500";
    if (s >= 4) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-sm text-zinc-400">
          <Heart className="h-4 w-4" />
          Health Score
        </span>
        <span className={cn("text-lg font-bold", getScoreColor(score))}>
          {score}/10
        </span>
      </div>
      <div className="flex gap-1">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-2 flex-1 rounded-full transition-all duration-300",
              i < score ? getBarColor(score) : "bg-zinc-800"
            )}
          />
        ))}
      </div>
    </div>
  );
}

// Compact view (inline)
function CompactNutritionLabel({
  data,
  onExpand,
}: {
  data: NutritionLabelType;
  onExpand: () => void;
}) {
  const getScoreColor = (s: number) => {
    if (s >= 8) return "text-emerald-400";
    if (s >= 6) return "text-amber-400";
    if (s >= 4) return "text-orange-400";
    return "text-red-400";
  };

  return (
    <button
      onClick={onExpand}
      className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-left transition-colors hover:border-zinc-700 hover:bg-zinc-900"
    >
      <div className="flex items-center gap-1.5">
        <Flame className="h-4 w-4 text-orange-400" />
        <span className="text-sm font-medium text-zinc-200">
          {data.nutrition.calories} cal
        </span>
      </div>
      <div className="h-4 w-px bg-zinc-700" />
      <div className="flex items-center gap-1.5">
        <Heart className="h-4 w-4 text-zinc-400" />
        <span className={cn("text-sm font-medium", getScoreColor(data.health.healthScore))}>
          {data.health.healthScore}/10
        </span>
      </div>
      <ChevronDown className="h-4 w-4 text-zinc-500" />
    </button>
  );
}

// Full nutrition label content
function FullNutritionLabel({ data }: { data: NutritionLabelType }) {
  const [showIngredients, setShowIngredients] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-4">
        <h3 className="text-lg font-semibold text-zinc-100">{data.dishName}</h3>
        <p className="text-sm text-zinc-500">
          Serving: {data.nutrition.servingSize} ({data.nutrition.servings} serving
          {data.nutrition.servings > 1 ? "s" : ""})
        </p>
      </div>

      {/* Dietary Tags */}
      {data.certifications.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {data.certifications.map((cert) => {
            const tag = dietaryTags[cert];
            return (
              <Badge
                key={cert}
                variant="outline"
                className={cn("text-xs", tag?.color || "border-zinc-700 text-zinc-400")}
              >
                {tag?.label || cert}
              </Badge>
            );
          })}
        </div>
      )}

      {/* Health Score */}
      <HealthScoreIndicator score={data.health.healthScore} />

      {/* Main Nutrition Facts */}
      <div className="space-y-4 rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
        <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
          <span className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Nutrition Facts
          </span>
          <div className="flex items-center gap-1">
            <Flame className="h-5 w-5 text-orange-400" />
            <span className="text-2xl font-bold text-zinc-100">
              {data.nutrition.calories}
            </span>
            <span className="text-sm text-zinc-500">cal</span>
          </div>
        </div>

        <div className="space-y-3">
          <NutritionBar
            label="Protein"
            value={data.nutrition.protein}
            unit="g"
            max={50}
            color="bg-blue-500"
            icon={Zap}
          />
          <NutritionBar
            label="Carbs"
            value={data.nutrition.carbs}
            unit="g"
            max={100}
            color="bg-amber-500"
            icon={Wheat}
          />
          <NutritionBar
            label="Fat"
            value={data.nutrition.fat}
            unit="g"
            max={65}
            color="bg-purple-500"
            icon={Droplets}
          />
          <NutritionBar
            label="Fiber"
            value={data.nutrition.fiber}
            unit="g"
            max={30}
            color="bg-green-500"
            icon={Leaf}
          />
          <NutritionBar
            label="Sugar"
            value={data.nutrition.sugar}
            unit="g"
            max={50}
            color="bg-pink-500"
          />
          <NutritionBar
            label="Sodium"
            value={data.nutrition.sodium}
            unit="mg"
            max={2300}
            color="bg-zinc-500"
          />
        </div>
      </div>

      {/* Health Benefits & Considerations */}
      <div className="grid gap-4 sm:grid-cols-2">
        {data.health.benefits.length > 0 && (
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
            <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-400">
              <Heart className="h-4 w-4" />
              Benefits
            </h4>
            <ul className="space-y-1">
              {data.health.benefits.map((benefit, i) => (
                <li key={i} className="text-sm text-zinc-300">
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        )}

        {data.health.considerations.length > 0 && (
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
            <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-amber-400">
              <Info className="h-4 w-4" />
              Considerations
            </h4>
            <ul className="space-y-1">
              {data.health.considerations.map((consideration, i) => (
                <li key={i} className="text-sm text-zinc-300">
                  {consideration}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Allergen Warnings */}
      {data.allergens.length > 0 && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
          <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold text-red-400">
            <AlertTriangle className="h-4 w-4" />
            Allergen Warning
          </h4>
          <p className="text-sm text-zinc-300">
            Contains: {data.allergens.join(", ")}
          </p>
        </div>
      )}

      {/* Ingredients (Collapsible) */}
      {data.ingredients.length > 0 && (
        <Collapsible open={showIngredients} onOpenChange={setShowIngredients}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between text-zinc-400 hover:text-zinc-200"
            >
              <span className="flex items-center gap-2">
                <Leaf className="h-4 w-4" />
                Ingredients ({data.ingredients.length})
              </span>
              {showIngredients ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4">
              <p className="text-sm leading-relaxed text-zinc-400">
                {data.ingredients.join(", ")}
              </p>
            </div>
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Dietary Highlights */}
      {data.health.dietaryHighlights.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {data.health.dietaryHighlights.map((highlight, i) => (
            <span
              key={i}
              className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400"
            >
              {highlight}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// Main component
export function NutritionLabel({
  dishName,
  compact = false,
  className,
}: NutritionLabelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const data = nutritionLabels[dishName];

  // No data available
  if (!data) {
    return (
      <div className={cn("text-sm text-zinc-500", className)}>
        Nutrition info not available
      </div>
    );
  }

  // Compact mode - show inline with dialog for full view
  if (compact) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div className={className}>
            <CompactNutritionLabel data={data} onExpand={() => setIsOpen(true)} />
          </div>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-zinc-800 bg-zinc-950 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="sr-only">Nutrition Information</DialogTitle>
          </DialogHeader>
          <FullNutritionLabel data={data} />
        </DialogContent>
      </Dialog>
    );
  }

  // Full inline display
  return (
    <div className={cn("rounded-xl border border-zinc-800 bg-zinc-950 p-6", className)}>
      <FullNutritionLabel data={data} />
    </div>
  );
}

export default NutritionLabel;
