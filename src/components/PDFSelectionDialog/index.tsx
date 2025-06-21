import React, { useState, useRef } from 'react';
import { Button, Box, Typography, Chip, Checkbox, styled } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Stage, getStageTitle, getStageActivities, getStageLabel } from '../../types/stage';
import {
  Activity,
  getActivityDescription,
  getActivityName,
  getActivityTitle,
} from '../../types/activity';
import { GenericDialog } from '../Dialog';
import DownloadIcon from '@mui/icons-material/Download';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import { WhiteCard } from '../../StyledComponents/StyledComponents';
import { PDFReport } from '../PDFReport';
import { Project } from '../../types/project';
import { State } from '../../types/state';
import { usePDFReport } from '../../hooks/usePDFReport';

interface PDFSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  project: Project;
}

export interface PDFSelection {
  stages: {
    [key in Stage]?: {
      selected: boolean;
      activities: {
        [key in Activity]?: boolean;
      };
    };
  };
  dqProblems: boolean;
  contextModel: boolean;
}

interface CustomChipProps {
  selected: boolean;
}

const CustomChip = styled(Chip)<CustomChipProps>(({ selected, theme }) => ({
  fontWeight: 600,
  fontSize: 12,
  size: 'small',
  variant: 'filled',
  color: selected ? theme.palette.text.primary : theme.palette.text.secondary,
  '& .MuiChip-label': {
    fontWeight: 'inherit',
  },
}));

const PDFDownloadButton: React.FC<{
  projectId: number;
  selection: PDFSelection;
  fileName: string;
}> = ({ projectId, selection, fileName }) => {
  const { t } = useTranslation();
  const downloadRef = useRef<any>(null);

  const { isLoading: isPDFReportLoading } = usePDFReport({ projectId });

  return (
    <PDFDownloadLink
      key="ready"
      document={<PDFReport projectId={projectId} selection={selection} />}
      fileName={fileName}
    >
      {({ loading: isPDFGenerating }) => {
        const isButtonLoading = isPDFReportLoading || isPDFGenerating;
        return (
          <Button
            ref={downloadRef}
            variant="contained"
            loading={isButtonLoading}
            disabled={isButtonLoading}
            startIcon={<DownloadIcon />}
          >
            {isButtonLoading ? t('loading') : t('export')}
          </Button>
        );
      }}
    </PDFDownloadLink>
  );
};

export const PDFSelectionDialog: React.FC<PDFSelectionDialogProps> = ({
  open,
  onClose,
  project,
}) => {
  const { t } = useTranslation();

  const [selection, setSelection] = useState<PDFSelection>(() => {
    const activeStages = project.stages.filter(ps => ps.status !== State.TO_DO).map(ps => ps.stage);

    return {
      stages: Object.fromEntries(
        activeStages.map(stage => [
          stage,
          {
            selected: true,
            activities: Object.fromEntries(
              getStageActivities(stage).map(activity => [activity, true])
            ),
          },
        ])
      ),
      dqProblems: true,
      contextModel: true,
    };
  });

  const handleStagesSelection = (selected: boolean) => {
    const activeStages = project.stages.filter(ps => ps.status !== State.TO_DO).map(ps => ps.stage);

    setSelection(prev => ({
      ...prev,
      stages: Object.fromEntries(
        activeStages.map(stage => [
          stage,
          {
            selected: selected,
            activities: Object.fromEntries(
              getStageActivities(stage).map(activity => [activity, selected])
            ),
          },
        ])
      ),
    }));
  };

  const handleStageChange = (stage: Stage, selected: boolean) => {
    setSelection(prev => ({
      ...prev,
      stages: {
        ...prev.stages,
        [stage]: {
          selected: selected,
          activities: Object.fromEntries(
            getStageActivities(stage).map(activity => [activity, selected])
          ),
        },
      },
    }));
  };

  const handleActivityChange =
    (stage: Stage, activity: Activity) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const checked = event.target.checked;
      setSelection(prev => ({
        ...prev,
        stages: {
          ...prev.stages,
          [stage]: {
            ...(prev.stages[stage] ?? {}),
            activities: {
              ...(prev.stages[stage]?.activities ?? {}),
              [activity]: checked,
            },
            selected:
              checked ||
              Object.values({
                ...(prev.stages[stage]?.activities ?? {}),
                [activity]: checked,
              }).some(Boolean),
          },
        },
      }));
    };

  const getSelectedCount = () => {
    const selectedStages = Object.values(selection.stages).filter(stage => stage?.selected).length;
    const selectedActivities = Object.values(selection.stages).reduce(
      (count, stage) => count + Object.values(stage?.activities || {}).filter(Boolean).length,
      0
    );
    return { stages: selectedStages, activities: selectedActivities };
  };

  const counts = getSelectedCount();
  const stages = project.stages.filter(ps => ps.status !== State.TO_DO).map(ps => ps.stage);

  const totalStages = stages.length;

  const dialogContent = (
    <Box display="flex" flexDirection="column" gap={1}>
      <Box display="flex" alignItems="center">
        <Checkbox
          size="small"
          checked={counts.stages === totalStages}
          indeterminate={counts.stages > 0 && counts.stages < totalStages}
          onChange={e => handleStagesSelection(e.target.checked)}
        />
        <Typography
          variant="subtitle2"
          color={counts.stages > 0 ? 'text.primary' : 'text.secondary'}
          textTransform="lowercase"
        >
          {counts.stages > 0
            ? `${counts.stages} ${t(counts.stages === 1 ? 'stage' : 'stages')} ${t('selected')}`
            : `${totalStages} ${t(totalStages === 1 ? 'stage' : 'stages')}`}
        </Typography>
      </Box>

      <Box maxHeight="60vh" overflow="auto">
        <Box display="flex" flexDirection="column" gap={2}>
          {stages.map(stage => {
            const isPartiallySelected =
              Object.values(selection.stages[stage]?.activities || {}).some(Boolean) &&
              !Object.values(selection.stages[stage]?.activities || {}).every(Boolean);
            const isStageChecked = selection.stages[stage]?.selected ?? false;

            return (
              <WhiteCard key={stage} sx={{ p: 2 }}>
                <Box display="flex" alignItems="center" mb={1}>
                  <Checkbox
                    size="small"
                    checked={isStageChecked}
                    indeterminate={isPartiallySelected}
                    onChange={e => handleStageChange(stage, e.target.checked)}
                    indeterminateIcon={<IndeterminateCheckBoxIcon />}
                  />
                  <Box display="flex" alignItems="center" gap={1} flex={1}>
                    <Typography
                      variant="subtitle2"
                      color={isStageChecked ? 'text.primary' : 'text.secondary'}
                    >
                      {t(getStageTitle(stage))}
                    </Typography>
                    <CustomChip label={t(getStageLabel(stage))} selected={isStageChecked} />
                  </Box>
                </Box>

                <Box pl={4} gap={2} display="flex" flexDirection="column">
                  {getStageActivities(stage).map(activity => {
                    const isChecked = selection.stages[stage]?.activities[activity] ?? false;
                    return (
                      <Box key={activity} display="flex" alignItems="center" gap={1}>
                        <Checkbox
                          size="small"
                          checked={isChecked}
                          onChange={handleActivityChange(stage, activity)}
                        />
                        <Box flex={1}>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography
                              variant="body2"
                              color={isChecked ? 'text.primary' : 'text.secondary'}
                            >
                              {t(getActivityName(activity))} - {t(getActivityTitle(activity))}
                            </Typography>
                            <CustomChip label={t(getActivityName(activity))} selected={isChecked} />
                          </Box>
                          <Typography
                            variant="caption"
                            color={isChecked ? 'text.primary' : 'text.secondary'}
                          >
                            {t(getActivityDescription(activity))}
                          </Typography>
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              </WhiteCard>
            );
          })}

          <WhiteCard sx={{ p: 2 }}>
            <Box gap={1} display="flex" flexDirection="column">
              <Box display="flex" alignItems="center" gap={1}>
                <Checkbox
                  size="small"
                  checked={selection.dqProblems}
                  onChange={e => {
                    const checked = e.target.checked;
                    setSelection(prev => ({
                      ...prev,
                      dqProblems: checked,
                    }));
                  }}
                />
                <Box flex={1}>
                  <Typography
                    variant="subtitle2"
                    color={selection.dqProblems ? 'text.primary' : 'text.secondary'}
                  >
                    {t('data-quality-problems-report')}
                  </Typography>
                  <Typography
                    variant="caption"
                    color={selection.dqProblems ? 'text.primary' : 'text.secondary'}
                  >
                    {t('data-quality-problems-report-description')}
                  </Typography>
                </Box>
              </Box>

              <Box display="flex" alignItems="center" gap={1}>
                <Checkbox
                  size="small"
                  checked={selection.contextModel}
                  onChange={e => {
                    const checked = e.target.checked;
                    setSelection(prev => ({
                      ...prev,
                      contextModel: checked,
                    }));
                  }}
                />
                <Box flex={1}>
                  <Typography
                    variant="subtitle2"
                    color={selection.contextModel ? 'text.primary' : 'text.secondary'}
                  >
                    {t('context-model-report')}
                  </Typography>
                  <Typography
                    variant="caption"
                    color={selection.contextModel ? 'text.primary' : 'text.secondary'}
                  >
                    {t('context-model-report-description')}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </WhiteCard>
        </Box>
      </Box>
    </Box>
  );

  const dialogActions = (
    <Box display="flex" justifyContent="flex-end" gap={1}>
      <Button onClick={onClose} variant="outlined">
        {t('cancel')}
      </Button>

      <PDFDownloadButton
        projectId={project.id}
        selection={selection}
        fileName={`${project.name}_report.pdf`}
      />
    </Box>
  );

  return (
    <GenericDialog
      open={open}
      onClose={onClose}
      title={t('pdf-selection-dialog-title')}
      subtitle={t('pdf-selection-dialog-subtitle')}
      content={dialogContent}
      actions={dialogActions}
      maxWidth="lg"
    />
  );
};
