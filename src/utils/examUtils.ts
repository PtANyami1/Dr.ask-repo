import { ExamTemplate, ExamValues } from '../types/exam';

export function getInitialValues(template: ExamTemplate): ExamValues {
  if ((template.type === 'multi-toggle' || template.type === 'multi-select') && template.subItems) {
    return Object.fromEntries(
      template.subItems
        .filter(sub => sub.defaultValue !== undefined)
        .map(sub => [sub.id, sub.defaultValue!])
    );
  }
  if (template.type === 'rom' && template.subItems) {
    return Object.fromEntries(
      template.subItems.flatMap(sub => [
        [`${sub.id}_val`, ''],
        [`${sub.id}_pain`, '-'],
      ])
    );
  }
  if (template.type === 'multi-input' && template.subItems) {
    return Object.fromEntries(template.subItems.map(sub => [sub.id, '']));
  }
  return { value: template.defaultValue ?? '' };
}

export function isModified(template: ExamTemplate, values: ExamValues): boolean {
  if ((template.type === 'multi-toggle' || template.type === 'multi-select') && template.subItems) {
    return template.subItems.some(sub => (values[sub.id] ?? sub.defaultValue) !== sub.defaultValue);
  }
  if (template.type === 'rom' && template.subItems) {
    return template.subItems.some(
      sub =>
        (values[`${sub.id}_val`] ?? '') !== '' ||
        (values[`${sub.id}_pain`] ?? '-') !== '-'
    );
  }
  if (template.type === 'multi-input' && template.subItems) {
    return template.subItems.some(sub => (values[sub.id] ?? '') !== '');
  }
  const val = values['value'] ?? '';
  return val !== '' && val !== (template.defaultValue ?? '');
}

export function formatOutput(template: ExamTemplate, values: ExamValues): string {
  if ((template.type === 'multi-toggle' || template.type === 'multi-select') && template.subItems) {
    const subResults = template.subItems
      .map(sub => `${sub.label}: ${values[sub.id] ?? sub.defaultValue}`)
      .join(', ');
    return ` - ${template.name}: [ ${subResults} ]`;
  }
  if (template.type === 'rom' && template.subItems) {
    const subResults = template.subItems
      .map(sub => {
        const val = values[`${sub.id}_val`] || sub.placeholder || '';
        const pain = values[`${sub.id}_pain`] || '-';
        return `${sub.label}: ${val}(${pain})`;
      })
      .join(', ');
    return ` - ${template.name}: [ ${subResults} ]`;
  }
  if (template.type === 'multi-input' && template.subItems) {
    const subResults = template.subItems
      .map(sub => `${sub.label}: ${values[sub.id] || sub.placeholder || ''}`)
      .join(', ');
    return ` - ${template.name}: [ ${subResults} ]`;
  }
  if (template.type === 'input') {
    return ` - ${template.name}: ${values['value'] || template.placeholder || template.defaultValue || ''}`;
  }
  return ` - ${template.name}: ${values['value'] ?? template.defaultValue}`;
}
