import { StyleSheet } from '@react-pdf/renderer';

export const styles = StyleSheet.create({
  headerLeft: {
    flex: 2,
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  projectDescription: {
    fontSize: 10,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
});
