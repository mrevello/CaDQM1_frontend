import React, { ReactNode } from 'react';
import {
  BarChart as RechartBarChart,
  XAxis as RechartXAxis,
  YAxis as RechartYAxis,
  Tooltip as RechartTooltip,
  Legend as RechartLegend,
  Bar,
  ResponsiveContainer,
} from 'recharts';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const COLORS = {
  blue: '#3182CE',
  sky: '#0EA5E9',
  green: '#10B981',
  red: '#EF4444',
  amber: '#F59E0B',
  purple: '#8B5CF6',
  violet: '#7C3AED',
  pink: '#EC4899',
  gray: '#6B7280',
};

type ColorKey = keyof typeof COLORS;

interface BarChartProps {
  data: any[];
  index: string;
  categories: string[];
  colors?: ColorKey[];
  valueFormatter?: (value: number) => string;
  children?: ReactNode;
  className?: string;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  index,
  categories,
  colors = ['blue'],
  valueFormatter = value => `${value}`,
  children,
  className,
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%" className={className}>
      <RechartBarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
        {children}
        {categories.map((category, i) => (
          <Bar
            key={category}
            dataKey={category}
            fill={COLORS[colors[i % colors.length]]}
            radius={[4, 4, 0, 0]}
          />
        ))}
        <RechartTooltip
          content={({ active, payload, label }) => {
            if (active && payload && payload.length) {
              return (
                <Paper
                  elevation={3}
                  sx={{
                    p: 1,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography variant="subtitle2">{label}</Typography>
                  {payload.map((item: any, index: number) => (
                    <Typography
                      key={index}
                      variant="body2"
                      sx={{
                        color: item.fill ?? COLORS[colors[index % colors.length]],
                      }}
                    >
                      {item.name}: {valueFormatter(item.value as number)}
                    </Typography>
                  ))}
                </Paper>
              );
            }
            return null;
          }}
        />
      </RechartBarChart>
    </ResponsiveContainer>
  );
};

export const XAxis = () => <RechartXAxis tick={{ fontSize: 12 }} />;
export const YAxis = () => <RechartYAxis tick={{ fontSize: 12 }} />;
export const Legend = () => <RechartLegend />;
export const Label = () => null;

export interface LegendItemProps {
  color: string;
  label: string;
}

export const LegendItem: React.FC<LegendItemProps> = ({ color, label }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
    <Box
      sx={{
        width: 12,
        height: 12,
        borderRadius: 0.5,
        backgroundColor: color,
      }}
    />
    <Typography variant="caption">{label}</Typography>
  </Box>
);
