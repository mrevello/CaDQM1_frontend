import { View, Text, StyleSheet } from '@react-pdf/renderer';

interface ListPDFProps {
  title?: string;
  items: string[];
}

export const ListPDF: React.FC<ListPDFProps> = ({ title, items }) => (
  <View>
    {title && <Text style={styles.title}>{title}</Text>}
    <View style={styles.list}>
      {items.map((item, index) => (
        <ListItemPDF key={index} text={item} />
      ))}
    </View>
  </View>
);

interface ListItemPDFProps {
  text: string;
  children?: React.ReactNode;
}

export const ListItemPDF: React.FC<ListItemPDFProps> = ({ text, children }) => (
  <View style={styles.listItem}>
    <Text style={styles.bullet}>•</Text>
    <Text style={styles.listItemText}>
      {text}
      {children}
    </Text>
  </View>
);

export const styles = StyleSheet.create({
  title: {
    fontSize: 11,
    fontWeight: 'medium',
    marginBottom: 4,
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  listItem: {
    flexDirection: 'row',
  },
  bullet: {
    fontSize: 12,
    marginRight: 4,
    marginLeft: 4,
  },
  listItemText: {
    flex: 1,
    fontSize: 10,
  },
});
