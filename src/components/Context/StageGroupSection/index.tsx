import { Box, Divider, Typography } from '@mui/material';
import {
  componentTypeToKey,
  ContextComponent,
  ContextComponentData,
  ContextComponentsType,
  ContextComponentType,
} from '../../../types/contextComponent';
import { ContextComponentList } from '../ContextComponentList';

interface StageGroupSectionProps {
  label: string;
  components: ContextComponentData<ContextComponent>[];
  prefix?: string;
  onEdit: (comp: ContextComponent, type: ContextComponentType) => void;
  onDelete: (comp: ContextComponent, type: ContextComponentType) => void;
  setContextComponents: React.Dispatch<React.SetStateAction<ContextComponentsType>>;
  loading?: boolean;
}

export const StageGroupSection: React.FC<StageGroupSectionProps> = ({
  label,
  components,
  prefix = label.toLowerCase(),
  onEdit,
  onDelete,
  setContextComponents,
  loading = false,
}) => {
  const setContextComponent =
    <T extends ContextComponent>(
      type: ContextComponentType,
      setContextComponents: React.Dispatch<React.SetStateAction<ContextComponentsType>>
    ): React.Dispatch<React.SetStateAction<ContextComponentData<T>>> =>
    updater => {
      setContextComponents(prev => {
        if (!prev) return prev;
        const key = componentTypeToKey[type];
        const slot = prev[key] as ContextComponentData<T> | null;
        if (!slot) return prev;

        // apply either an updater fn or a direct value
        const newSlot =
          typeof updater === 'function'
            ? (updater as (old: ContextComponentData<T>) => ContextComponentData<T>)(slot)
            : updater;

        return {
          ...prev,
          [key]: newSlot,
        };
      });
    };

  if (!components.length) return null;

  return (
    <Box key={label} sx={{ mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
        <Typography variant="caption">{label}</Typography>
        <Divider sx={{ flexGrow: 1 }} />
      </Box>

      {components.map(component => (
        <ContextComponentList
          key={`${prefix}-${component.type}`}
          itemId={`${prefix}-${component.type}`}
          component={component}
          onEdit={onEdit}
          onDelete={onDelete}
          setContextComponent={setContextComponent(component.type, setContextComponents)}
          loading={loading}
        />
      ))}
    </Box>
  );
};
