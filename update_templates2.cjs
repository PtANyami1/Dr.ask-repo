const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/examTemplates.json', 'utf8'));

const newData = data.map(item => {
  // 1. Apley
  if (item.id === 'shoulder_apley1' || item.id === 'shoulder_apley2') {
    return {
      ...item,
      type: 'rom',
      defaultValue: undefined,
      options: undefined,
      subItems: [
        { id: "rt", label: "Rt", placeholder: "T7" },
        { id: "lt", label: "Lt", placeholder: "T7" }
      ]
    };
  }
  
  // 2. Pupil
  if (item.id === 'cva_pupil') {
    return {
      ...item,
      type: 'multi-toggle',
      defaultValue: undefined,
      options: undefined,
      subItems: [
        { id: "rt", label: "Rt", options: ["0", "Ø"], defaultValue: "0" },
        { id: "lt", label: "Lt", options: ["0", "Ø"], defaultValue: "0" }
      ]
    };
  }

  // 3. GCS & NIHSS
  if (item.id === 'cva_gcs') {
    return { ...item, defaultValue: "15(E4 V5 M6)", placeholder: "15(E4 V5 M6)" };
  }
  if (item.id === 'cva_nihss') {
    return { ...item, defaultValue: "정상", placeholder: "정상" };
  }

  // 4. Muscle power
  if (item.id === 'motor_power') {
    return {
      ...item,
      type: 'multi-toggle',
      defaultValue: undefined,
      options: undefined,
      subItems: [
        { id: "upper_rt", label: "U(Rt)", options: ["5", "4", "3", "2", "1", "0"], defaultValue: "5" },
        { id: "upper_lt", label: "U(Lt)", options: ["5", "4", "3", "2", "1", "0"], defaultValue: "5" },
        { id: "lower_rt", label: "L(Rt)", options: ["5", "4", "3", "2", "1", "0"], defaultValue: "5" },
        { id: "lower_lt", label: "L(Lt)", options: ["5", "4", "3", "2", "1", "0"], defaultValue: "5" }
      ]
    };
  }

  // 5. 족과굴신, 족지굴신, 수지굴신
  if (['motor_ankle_flex', 'motor_toe_flex', 'motor_finger_flex'].includes(item.id)) {
    return {
      ...item,
      type: 'multi-toggle',
      defaultValue: undefined,
      options: undefined,
      subItems: [
        { id: "rt", label: "Rt", options: ["can", "can't"], defaultValue: "can" },
        { id: "lt", label: "Lt", options: ["can", "can't"], defaultValue: "can" }
      ]
    };
  }

  return item;
});

fs.writeFileSync('src/data/examTemplates.json', JSON.stringify(newData, null, 2));
console.log('Done');
