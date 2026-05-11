import React from 'react';
import { motion } from 'motion/react';
import { PropertyInfo, LoanScheme } from '../types';
import { getLTVLadder } from '../utils';
import { SectionHeader } from '../components/SectionHeader';
import { ToggleRow } from '../components/Toggle';
import { Segmented } from '../components/Segmented';
import { Field } from '../components/Field';

interface Props {
  property: PropertyInfo;
  scheme: LoanScheme;
  onChange: <K extends keyof PropertyInfo>(field: K, value: PropertyInfo[K]) => void;
}

export const GracePeriodSection: React.FC<Props> = ({ property, scheme, onChange }) => {
  const ltvOptions = getLTVLadder(scheme, property).map(val => ({
    label: `${(val * 100).toFixed(0)}%`,
    value: val
  }));

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="input-card p-4 md:p-6"
    >
      <SectionHeader number="03" title="寬限期試算" className="mb-4" />

      <div className="space-y-4">
        <ToggleRow 
          label="需要寬限期"
          checked={property.needsGracePeriod}
          onChange={(v) => onChange('needsGracePeriod', v)}
        />

        {property.needsGracePeriod && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-4 pt-4 border-t border-border-earth overflow-hidden"
          >
            <Field label="寬限期試算貸款成數">
              <Segmented 
                options={ltvOptions}
                value={property.gracePeriodLTV || (scheme === LoanScheme.NEST_NEST ? 0.85 : 0.8)}
                onChange={(v) => onChange('gracePeriodLTV', v)}
                size="sm"
                className="overflow-x-auto no-scrollbar"
              />
            </Field>
            <p className="text-[10px] text-text-muted italic leading-relaxed">
              ※ 勾選後下方將顯示各寬限期所需之年薪門檻。
            </p>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};
