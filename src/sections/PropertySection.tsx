import React from 'react';
import { motion } from 'motion/react';
import { PropertyInfo } from '../types';
import { TAIWAN_CITIES, CITY_BY_NAME, SPECIAL_VILLAGES } from '../constants';
import { SectionHeader } from '../components/SectionHeader';
import { NumberField } from '../components/NumberField';
import { Field } from '../components/Field';
import { Segmented } from '../components/Segmented';
import { formatCurrency } from '../utils';

interface Props {
  property: PropertyInfo;
  onChange: <K extends keyof PropertyInfo>(field: K, value: PropertyInfo[K]) => void;
}

export const PropertySection: React.FC<Props> = ({ property, onChange }) => {
  const currentCity = CITY_BY_NAME.get(property.city);
  const villages = SPECIAL_VILLAGES[property.district];

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="input-card p-4 md:p-6"
    >
      <SectionHeader number="02" title="購房細節" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="縣市">
          <select 
            value={property.city}
            onChange={(e) => onChange('city', e.target.value)}
            className="input-field appearance-none"
          >
            {TAIWAN_CITIES.map(city => (
              <option key={city.name} value={city.name}>{city.name}</option>
            ))}
          </select>
        </Field>

        <Field label="鄉鎮市區">
          <select 
            value={property.district}
            onChange={(e) => onChange('district', e.target.value)}
            className="input-field appearance-none"
          >
            {currentCity && (
              <>
                {currentCity.zones.A.length > 0 && (
                  <optgroup label="A 區 (最高 8 成)">
                    {currentCity.zones.A.map(d => <option key={d} value={d}>{d}</option>)}
                  </optgroup>
                )}
                {currentCity.zones.B.length > 0 && (
                  <optgroup label="B 區 (最高 7.5 成)">
                    {currentCity.zones.B.map(d => <option key={d} value={d}>{d}</option>)}
                  </optgroup>
                )}
                {currentCity.zones.C.length > 0 && (
                  <optgroup label="C 區 (最高 7 成)">
                    {currentCity.zones.C.map(d => <option key={d} value={d}>{d}</option>)}
                  </optgroup>
                )}
                {currentCity.zones.D.length > 0 && (
                  <optgroup label="D 區 (最高 6.5 成)">
                    {currentCity.zones.D.map(d => <option key={d} value={d}>{d}</option>)}
                  </optgroup>
                )}
              </>
            )}
          </select>
        </Field>

        {villages && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="md:col-span-2 overflow-hidden"
          >
            <Field label="里">
              <select 
                value={property.subDistrict || ''}
                onChange={(e) => onChange('subDistrict', e.target.value)}
                className="input-field appearance-none"
              >
                {villages.map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
                <option value="">其他</option>
              </select>
            </Field>
          </motion.div>
        )}

        <div className="md:col-span-2">
          <Segmented 
            options={[
              { label: '預售屋', value: 1 },
              { label: '成屋 / 中古', value: 0 }
            ]}
            value={property.isPreSale ? 1 : 0}
            onChange={(v) => onChange('isPreSale', !!v)}
          />
        </div>

        <NumberField 
          label="購屋總價 (萬)"
          value={property.purchasePrice}
          onChange={(v) => onChange('purchasePrice', v)}
          suffix="萬"
          helperText={property.purchasePrice ? `等於 ${formatCurrency(property.purchasePrice * 10000)}` : undefined}
        />

        {!property.isPreSale && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <NumberField 
              label="房屋屋齡"
              value={property.houseAge}
              onChange={(v) => onChange('houseAge', v)}
              suffix="年"
            />
          </motion.div>
        )}
      </div>
    </motion.section>
  );
};
