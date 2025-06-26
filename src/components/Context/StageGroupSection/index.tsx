import { Box, Divider, Typography } from '@mui/material';
import {
  ContextComponent,
  ContextComponentData,
  ContextComponentType,
} from '../../../types/contextComponent';
import { ContextComponentList } from '../ContextComponentList';

interface StageGroupSectionProps {
  label: string;
  components: ContextComponentData<ContextComponent>[];
  prefix?: string;
  onEdit: (comp: ContextComponent, type: ContextComponentType) => void;
  onDelete: (comp: ContextComponent, type: ContextComponentType) => void;
  loading?: boolean;
}

export const StageGroupSection: React.FC<StageGroupSectionProps> = ({
  label,
  components,
  prefix = label.toLowerCase(),
  onEdit,
  onDelete,
  loading = false,
}) => {
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
          loading={loading}
        />
      ))}
    </Box>
  );
};
