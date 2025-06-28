import { StyleSheet } from '@react-pdf/renderer';

export const stageDataPDFStyles = StyleSheet.create({
  stageTitle: {
    display: 'flex',
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  stagesContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: 24,
  },
});
