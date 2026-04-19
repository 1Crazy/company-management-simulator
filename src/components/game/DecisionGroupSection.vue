<script setup lang="ts">
import type { DraftPlan } from "@/types/app";
import type { DecisionFieldGroup } from "@/types/help";
import DecisionFieldCard from "./DecisionFieldCard.vue";

defineProps<{
  group: DecisionFieldGroup;
  values: DraftPlan;
}>();

defineEmits<{
  updateField: [field: keyof DraftPlan, value: number];
}>();
</script>

<template>
  <section class="panel-soft grid gap-4 px-4 py-4">
    <div class="flex items-start justify-between gap-3">
      <div>
        <div class="text-xs font-bold tracking-[0.12em] text-[var(--control-navy)]">{{ group.title }}</div>
        <h3 class="mt-1 text-lg font-semibold text-slate-900">{{ group.title }}操盘区</h3>
        <p class="mt-2 text-sm leading-6 text-slate-600">{{ group.description }}</p>
      </div>
      <span class="guide-badge-subtle">{{ group.fields.length }} 项</span>
    </div>

    <div class="grid gap-3">
      <DecisionFieldCard
        v-for="item in group.fields"
        :key="item.field"
        :definition="item"
        :value="values[item.field]"
        @update="$emit('updateField', item.field, $event)"
      />
    </div>
  </section>
</template>
