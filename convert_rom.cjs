const fs = require('fs');
const data = JSON.parse(fs.readFileSync('src/data/examTemplates.json', 'utf8'));

const newData = data.map(item => {
  if (item.type === 'input') {
    let placeholder = item.defaultValue;
    
    const romMappings = {
      "neck_flex": [{id: "flex", label: "Flex", placeholder: "45"}],
      "neck_ext": [{id: "ext", label: "Ext", placeholder: "45"}],
      "neck_lat_flex": [{id: "rt", label: "Rt", placeholder: "45"}, {id: "lt", label: "Lt", placeholder: "45"}],
      "neck_rot": [{id: "rt", label: "Rt", placeholder: "60"}, {id: "lt", label: "Lt", placeholder: "60"}],
      "lbp_slr": [{id: "rt", label: "Rt", placeholder: "80"}, {id: "lt", label: "Lt", placeholder: "80"}],
      "lbp_flex": [{id: "flex", label: "Flex", placeholder: "80"}],
      "lbp_ext": [{id: "ext", label: "Ext", placeholder: "20"}],
      "lbp_lat_flex": [{id: "rt", label: "Rt", placeholder: "35"}, {id: "lt", label: "Lt", placeholder: "35"}],
      "lbp_rot": [{id: "rt", label: "Rt", placeholder: "45"}, {id: "lt", label: "Lt", placeholder: "45"}],
      "shoulder_flex_ext": [
        {id: "flex_rt", label: "Flex(Rt)", placeholder: "180"}, {id: "flex_lt", label: "Flex(Lt)", placeholder: "180"},
        {id: "ext_rt", label: "Ext(Rt)", placeholder: "60"}, {id: "ext_lt", label: "Ext(Lt)", placeholder: "60"}
      ],
      "shoulder_abd_add": [
        {id: "abd_rt", label: "Abd(Rt)", placeholder: "180"}, {id: "abd_lt", label: "Abd(Lt)", placeholder: "180"},
        {id: "add_rt", label: "Add(Rt)", placeholder: "75"}, {id: "add_lt", label: "Add(Lt)", placeholder: "75"}
      ],
      "shoulder_rot": [
        {id: "int_rt", label: "Int(Rt)", placeholder: "90"}, {id: "int_lt", label: "Int(Lt)", placeholder: "90"},
        {id: "ext_rt", label: "Ext(Rt)", placeholder: "90"}, {id: "ext_lt", label: "Ext(Lt)", placeholder: "90"}
      ],
      "elbow_flex": [{id: "rt", label: "Rt", placeholder: "150"}, {id: "lt", label: "Lt", placeholder: "150"}],
      "wrist_ext_flex": [
        {id: "ext_rt", label: "Ext(Rt)", placeholder: "70"}, {id: "ext_lt", label: "Ext(Lt)", placeholder: "70"},
        {id: "flex_rt", label: "Flex(Rt)", placeholder: "80"}, {id: "flex_lt", label: "Flex(Lt)", placeholder: "80"}
      ],
      "wrist_rad_ulnar": [
        {id: "rad_rt", label: "Rad(Rt)", placeholder: "15"}, {id: "rad_lt", label: "Rad(Lt)", placeholder: "15"},
        {id: "uln_rt", label: "Ulnar(Rt)", placeholder: "30"}, {id: "uln_lt", label: "Ulnar(Lt)", placeholder: "30"}
      ],
      "wrist_sup_pro": [
        {id: "sup_rt", label: "Sup(Rt)", placeholder: "90"}, {id: "sup_lt", label: "Sup(Lt)", placeholder: "90"},
        {id: "pro_rt", label: "Pro(Rt)", placeholder: "90"}, {id: "pro_lt", label: "Pro(Lt)", placeholder: "90"}
      ],
      "hip_flex_ext": [
        {id: "flex_rt", label: "Flex(Rt)", placeholder: "135"}, {id: "flex_lt", label: "Flex(Lt)", placeholder: "135"},
        {id: "ext_rt", label: "Ext(Rt)", placeholder: "30"}, {id: "ext_lt", label: "Ext(Lt)", placeholder: "30"}
      ],
      "hip_add_abd": [
        {id: "add_rt", label: "Add(Rt)", placeholder: "30"}, {id: "add_lt", label: "Add(Lt)", placeholder: "30"},
        {id: "abd_rt", label: "Abd(Rt)", placeholder: "45"}, {id: "abd_lt", label: "Abd(Lt)", placeholder: "45"}
      ],
      "hip_rot": [
        {id: "int_rt", label: "Int(Rt)", placeholder: "45"}, {id: "int_lt", label: "Int(Lt)", placeholder: "45"},
        {id: "ext_rt", label: "Ext(Rt)", placeholder: "35"}, {id: "ext_lt", label: "Ext(Lt)", placeholder: "35"}
      ],
      "knee_flex_ext": [
        {id: "flex_rt", label: "Flex(Rt)", placeholder: "135"}, {id: "flex_lt", label: "Flex(Lt)", placeholder: "135"},
        {id: "ext_rt", label: "Ext(Rt)", placeholder: "0"}, {id: "ext_lt", label: "Ext(Lt)", placeholder: "0"}
      ],
      "ankle_dorsi_plantar": [
        {id: "dorsi_rt", label: "Dorsi(Rt)", placeholder: "20"}, {id: "dorsi_lt", label: "Dorsi(Lt)", placeholder: "20"},
        {id: "plantar_rt", label: "Plantar(Rt)", placeholder: "50"}, {id: "plantar_lt", label: "Plantar(Lt)", placeholder: "50"}
      ],
      "ankle_inv_ev": [
        {id: "inv_rt", label: "Inv(Rt)", placeholder: "35"}, {id: "inv_lt", label: "Inv(Lt)", placeholder: "35"},
        {id: "ev_rt", label: "Ev(Rt)", placeholder: "25"}, {id: "ev_lt", label: "Ev(Lt)", placeholder: "25"}
      ]
    };

    if (romMappings[item.id]) {
      return { ...item, type: 'rom', subItems: romMappings[item.id], defaultValue: undefined };
    }

    if (item.id === 'lbp_bragard') {
      return {
        ...item,
        type: 'multi-toggle',
        defaultValue: undefined,
        subItems: [
          { id: "bragard_rt", label: "Bragard(Rt)", options: ["-", "+"], defaultValue: "-" },
          { id: "bragard_lt", label: "Bragard(Lt)", options: ["-", "+"], defaultValue: "-" },
          { id: "lasegue_rt", label: "Lasegue(Rt)", options: ["-", "+"], defaultValue: "-" },
          { id: "lasegue_lt", label: "Lasegue(Lt)", options: ["-", "+"], defaultValue: "-" },
          { id: "femoral_rt", label: "Femoral(Rt)", options: ["-", "+"], defaultValue: "-" },
          { id: "femoral_lt", label: "Femoral(Lt)", options: ["-", "+"], defaultValue: "-" }
        ]
      };
    }
    if (item.id === 'knee_drawer') {
      return {
        ...item,
        type: 'multi-toggle',
        defaultValue: undefined,
        subItems: [
          { id: "drawer_rt", label: "Drawer(Rt)", options: ["-", "+"], defaultValue: "-" },
          { id: "drawer_lt", label: "Drawer(Lt)", options: ["-", "+"], defaultValue: "-" },
          { id: "dist_rt", label: "Distraction(Rt)", options: ["-", "+"], defaultValue: "-" },
          { id: "dist_lt", label: "Distraction(Lt)", options: ["-", "+"], defaultValue: "-" },
          { id: "lachman_rt", label: "Lachman(Rt)", options: ["-", "+"], defaultValue: "-" },
          { id: "lachman_lt", label: "Lachman(Lt)", options: ["-", "+"], defaultValue: "-" }
        ]
      };
    }

    return { ...item, placeholder: placeholder, defaultValue: undefined };
  }
  return item;
});

fs.writeFileSync('src/data/examTemplates.json', JSON.stringify(newData, null, 2));
console.log('Done');
