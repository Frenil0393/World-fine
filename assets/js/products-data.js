/* ============================================================
   WFBC — Products Data — Central source of truth
   ============================================================ */
const WFBC_PRODUCTS = [
  {
    id: 'agroprime-boost', name: 'AgroPrime Boost',
    tagline: 'High-performance growth enhancer for field crops.',
    category: 'agro', categoryLabel: 'Agro Chemical',
    purity: '98% purity', base: 'Synthetic',
    packSizes: ['1L', '5L', '20L'],
    images: ['assets/images/products/agro/agroprime-1.jpg','assets/images/products/agro/agroprime-2.jpg','assets/images/products/agro/agroprime-3.jpg','assets/images/products/agro/agroprime-4.jpg','assets/images/products/agro/agroprime-5.jpg'],
    heroColor: '#1C4A30',
    description: 'AgroPrime Boost is a precision-formulated crop support chemical designed for high-output field agriculture. With 98% active ingredient purity, it delivers consistent results across a wide range of crop types, reducing crop stress during critical growth windows.',
    specs: [
      {label:'Purity',value:'98% min.'},{label:'Form',value:'Liquid concentrate'},
      {label:'pH Range',value:'5.5 – 7.0'},{label:'Shelf Life',value:'24 months'},
      {label:'Storage',value:'Cool, dry, away from sunlight'},{label:'Pack Sizes',value:'1L · 5L · 20L'},
      {label:'Dilution Rate',value:'2–5 ml per litre water'},{label:'Applications',value:'Foliar spray, soil drench'}
    ],
    applications: [
      {icon:'🌾',title:'Cereal Crops',desc:'Wheat, rice, and corn during vegetative to grain fill stages.'},
      {icon:'🥬',title:'Vegetables',desc:'Leafy and fruit vegetables for improved uniformity.'},
      {icon:'🌿',title:'Pulses & Legumes',desc:'Supports nitrogen fixation and root nodulation.'}
    ],
    related: ['rootmax-plus','bloompro-regulator','solufeed-wsf']
  },
  {
    id: 'rootmax-plus', name: 'RootMax Plus',
    tagline: 'Focused on root vigor and seedling survival.',
    category: 'agro', categoryLabel: 'Agro Chemical',
    purity: 'Organic base', base: 'Bio-organic',
    packSizes: ['500ml', '1L'],
    images: ['assets/images/products/agro/rootmax-1.jpg','assets/images/products/agro/rootmax-2.jpg','assets/images/products/agro/agroprime-3.jpg','assets/images/products/agro/agroprime-4.jpg','assets/images/products/pgr/bloompro-1.jpg'],
    heroColor: '#2A3D2F',
    description: 'RootMax Plus delivers targeted root biostimulant chemistry derived from seaweed extracts and humic acid complexes. Its unique organic base supports both transplant survival and ongoing root mass development throughout the crop cycle.',
    specs: [
      {label:'Base',value:'Seaweed + Humic acid'},{label:'Form',value:'Liquid concentrate'},
      {label:'pH',value:'4.0 – 6.0'},{label:'Shelf Life',value:'18 months'},
      {label:'Storage',value:'Cool, dark location'},{label:'Pack Sizes',value:'500ml · 1L'},
      {label:'Dilution Rate',value:'3 ml per litre'},{label:'Applications',value:'Soil drench, transplant dip'}
    ],
    applications: [
      {icon:'🌱',title:'Seedlings',desc:'Accelerates root development in nursery trays.'},
      {icon:'🌳',title:'Transplants',desc:'Reduces shock and improves survival rate.'},
      {icon:'💧',title:'Hydroponics',desc:'Compatible with soilless growing systems.'}
    ],
    related: ['agroprime-boost','bloompro-regulator','solufeed-wsf']
  },
  {
    id: 'bloompro-regulator', name: 'BloomPro Regulator',
    tagline: 'Special crop regulation blend for flower and fruit support.',
    category: 'pgr', categoryLabel: 'PGR',
    purity: 'Flowering control', base: 'Greenhouse',
    packSizes: ['250ml', '1L'],
    images: ['assets/images/products/pgr/bloompro-1.jpg','assets/images/products/pgr/bloompro-2.jpg','assets/images/products/agro/agroprime-2.jpg','assets/images/products/agro/agroprime-4.jpg','assets/images/products/agro/agroprime-3.jpg'],
    heroColor: '#3D2A3F',
    description: 'BloomPro Regulator is a precision plant growth regulator formulated for commercial floriculture and high-value fruit crop producers. Its unique hormone balance creates ideal conditions for uniform flower initiation and extended bloom periods.',
    specs: [
      {label:'Active Substance',value:'Chlormequat + Plant hormones'},{label:'Form',value:'Emulsifiable concentrate'},
      {label:'pH',value:'5.0 – 7.5'},{label:'Shelf Life',value:'24 months (sealed)'},
      {label:'Application',value:'Foliar spray, drip'},{label:'Pack Sizes',value:'250ml · 1L'},
      {label:'Dilution',value:'1 ml per litre water'},{label:'Use Stage',value:'Pre-flowering to early fruit set'}
    ],
    applications: [
      {icon:'🌸',title:'Floriculture',desc:'Uniform bloom timing for commercial cut flowers.'},
      {icon:'🍓',title:'Berry Crops',desc:'Improves fruit set and berry size.'},
      {icon:'🏭',title:'Greenhouse Crops',desc:'Supports high-density growing schedules.'}
    ],
    related: ['agroprime-boost','rootmax-plus','solufeed-wsf']
  },
  {
    id: 'solufeed-wsf', name: 'SoluFeed WSF',
    tagline: 'Pure crystals for drip irrigation systems.',
    category: 'fertilizer', categoryLabel: 'WSF',
    purity: 'Fertigation ready', base: 'NPK blend',
    packSizes: ['25kg'],
    images: ['assets/images/products/fertilizer/solufeed-1.jpg','assets/images/products/fertilizer/solufeed-2.jpg','assets/images/products/agro/agroprime-2.jpg','assets/images/products/agro/agroprime-3.jpg','assets/images/products/agro/rootmax-2.jpg'],
    heroColor: '#1A3550',
    description: 'SoluFeed WSF is a premium water-soluble fertilizer produced in pure crystal form for maximum solubility in drip irrigation and hydroponics systems. With zero chloride content and ultra-high purity, it integrates cleanly into any drip system.',
    specs: [
      {label:'NPK Ratio',value:'20-20-20 + TE (standard)'},{label:'Purity',value:'99.5% water solubility'},
      {label:'Form',value:'Fine crystal'},{label:'Chloride',value:'Chloride-free'},
      {label:'Pack Size',value:'25 kg sealed bag'},{label:'pH in Solution',value:'5.5 – 6.5'},
      {label:'Application Rate',value:'2–4 kg per 1000 sq m'},{label:'Shelf Life',value:'36 months in sealed bags'}
    ],
    applications: [
      {icon:'💧',title:'Drip Fertigation',desc:'Clean dissolution for drip and micro-irrigation.'},
      {icon:'🥦',title:'Vegetable Crops',desc:'Stage-specific NPK ratios for full-cycle nutrition.'},
      {icon:'🌴',title:'Orchards',desc:'Reliable mineral delivery for high-value tree crops.'}
    ],
    related: ['agroprime-boost','rootmax-plus','bloompro-regulator']
  },
  {
    id: 'cleanpro-industrial', name: 'CleanPro Industrial',
    tagline: 'Industrial cleaning chemical for maintenance use.',
    category: 'industrial', categoryLabel: 'Industrial Chemical',
    purity: 'Cleaning chemistry', base: '5L to 50L',
    packSizes: ['5L', '20L', '50L'],
    images: ['assets/images/products/industrial/cleanpro-1.jpg','assets/images/products/industrial/ecosolv-1.jpg','assets/images/products/agro/agroprime-3.jpg','assets/images/products/agro/agroprime-5.jpg','assets/images/products/agro/rootmax-2.jpg'],
    heroColor: '#1A2A3D',
    description: 'CleanPro Industrial is a heavy-duty cleaning concentrate formulated for industrial, manufacturing, and commercial maintenance environments. Its surfactant-rich chemistry rapidly emulsifies oil, grease, and particulate contamination.',
    specs: [
      {label:'Form',value:'Liquid concentrate'},{label:'Appearance',value:'Clear amber liquid'},
      {label:'pH (neat)',value:'11.5 – 13.0'},{label:'Flash Point',value:'Non-flammable'},
      {label:'Dilution',value:'1:20 to 1:100'},{label:'Pack Sizes',value:'5L · 20L · 50L'},
      {label:'Shelf Life',value:'24 months sealed'},{label:'Compliance',value:'Biodegradable, low-VOC'}
    ],
    applications: [
      {icon:'🏭',title:'Manufacturing Plants',desc:'Floor, equipment, and conveyor cleaning.'},
      {icon:'⚙️',title:'Machine Maintenance',desc:'Degreasing of mechanical components.'},
      {icon:'🏢',title:'Commercial Facilities',desc:'High-traffic area hygiene and sanitization.'}
    ],
    related: ['ecosolv-blend','scaleguard-green','spocochem-pro']
  },
  {
    id: 'ecosolv-blend', name: 'EcoSolv Blend',
    tagline: 'Solvent blend for industrial and specialty use.',
    category: 'industrial', categoryLabel: 'Solvent',
    purity: 'Utility solvent', base: 'General purpose',
    packSizes: ['10L', '50L'],
    images: ['assets/images/products/industrial/ecosolv-1.jpg','assets/images/products/industrial/cleanpro-1.jpg','assets/images/products/agro/agroprime-3.jpg','assets/images/products/agro/agroprime-5.jpg','assets/images/products/agro/rootmax-2.jpg'],
    heroColor: '#1D3530',
    description: 'EcoSolv Blend is a versatile industrial solvent formulated from a carefully optimised mixture of bio-derived and petroleum-derived solvents. Reduced aromatic content and improved biodegradability without compromising solvency power.',
    specs: [
      {label:'Form',value:'Clear liquid'},{label:'Boiling Range',value:'120–180°C'},
      {label:'Flash Point',value:'42°C (closed cup)'},{label:'Aromatic Content',value:'<1% (low aromatic)'},
      {label:'Pack Sizes',value:'10L · 50L'},{label:'Shelf Life',value:'24 months sealed'},
      {label:'Applications',value:'Thinning, cleaning, extraction'},{label:'Compliance',value:'REACH compliant'}
    ],
    applications: [
      {icon:'🎨',title:'Coatings & Paints',desc:'Thinning alkyd and oil-based formulations.'},
      {icon:'🔧',title:'Parts Cleaning',desc:'Precision degreasing of mechanical parts.'},
      {icon:'🧪',title:'Specialty Chemistry',desc:'Resin dissolution and extraction processes.'}
    ],
    related: ['cleanpro-industrial','scaleguard-green','spocochem-pro']
  },
  {
    id: 'scaleguard-green', name: 'ScaleGuard Green',
    tagline: 'Eco anti-scale treatment for boilers and towers.',
    category: 'industrial', categoryLabel: 'Industrial Chemical',
    purity: 'Water systems', base: '35kg',
    packSizes: ['35kg'],
    images: ['assets/images/products/industrial/scaleguard-1.jpg','assets/images/products/industrial/cleanpro-1.jpg','assets/images/products/industrial/ecosolv-1.jpg','assets/images/products/agro/agroprime-3.jpg','assets/images/products/fertilizer/solufeed-1.jpg'],
    heroColor: '#1C3040',
    description: 'ScaleGuard Green is a phosphonate-based antiscalant and corrosion inhibitor for industrial cooling towers, boilers, and process water systems. Prevents calcium carbonate, calcium sulfate, and silica scale from forming on heat-exchange surfaces.',
    specs: [
      {label:'Active Ingredient',value:'HEDP + ATMP blend'},{label:'Form',value:'Powder / granules'},
      {label:'Pack Size',value:'35 kg sealed drum'},{label:'Dosage Rate',value:'5–20 ppm in system water'},
      {label:'pH Range (use)',value:'6.5 – 9.5'},{label:'Shelf Life',value:'24 months sealed'},
      {label:'Scale Prevention',value:'CaCO3, CaSO4, SiO2'},{label:'Compliance',value:'Low-P, biodegradable'}
    ],
    applications: [
      {icon:'🌡️',title:'Cooling Towers',desc:'Prevents mineral scale on fill and heat exchangers.'},
      {icon:'🔥',title:'Boiler Systems',desc:'Maintains heat transfer efficiency.'},
      {icon:'🏗️',title:'Process Water',desc:'Suitable for closed-loop industrial water treatment.'}
    ],
    related: ['cleanpro-industrial','ecosolv-blend','spocochem-pro']
  },
  {
    id: 'spocochem-pro', name: 'SpecoChem Pro',
    tagline: 'Custom speciality chemical for tailored applications.',
    category: 'industrial', categoryLabel: 'Speciality',
    purity: 'Speciality chemistry', base: 'Custom',
    packSizes: ['Custom'],
    images: ['assets/images/products/industrial/spocochem-1.jpg','assets/images/products/industrial/cleanpro-1.jpg','assets/images/products/industrial/ecosolv-1.jpg','assets/images/products/industrial/scaleguard-1.jpg','assets/images/products/fertilizer/solufeed-1.jpg'],
    heroColor: '#2A1C3D',
    description: 'SpecoChem Pro represents WFBC\'s bespoke specialty chemicals service — formulations developed in collaboration with industrial buyers who require precise chemical specifications not met by standard catalog products.',
    specs: [
      {label:'Form',value:'As per specification'},{label:'Pack Size',value:'Custom (MOQ negotiable)'},
      {label:'Lead Time',value:'2–4 weeks (first batch)'},{label:'Quality',value:'CoA with every batch'},
      {label:'Regulatory',value:'Full SDS provided'},{label:'MOQ',value:'From 50 kg'},
      {label:'Customisation',value:'Full formulation service'},{label:'Applications',value:'Industrial, textile, specialty'}
    ],
    applications: [
      {icon:'🧬',title:'Custom Formulation',desc:'Developed to your precise technical specification.'},
      {icon:'🏭',title:'Industrial Manufacturing',desc:'Process chemicals for production lines.'},
      {icon:'🧵',title:'Textile & Surface',desc:'Auxiliaries for textile and coating industries.'}
    ],
    related: ['cleanpro-industrial','ecosolv-blend','scaleguard-green']
  },
  {
    id: 'labpure-grade-a', name: 'LabPure Grade A',
    tagline: 'Laboratory supply for testing and quality control.',
    category: 'lab', categoryLabel: 'Lab Chemical',
    purity: 'QC ready', base: 'Lab chemical',
    packSizes: ['500ml', '1L', '5L'],
    images: ['assets/images/products/lab/labpure-1.jpg','assets/images/products/lab/labglass-1.jpg','assets/images/products/lab/labglass-2.jpg','assets/images/products/agro/agroprime-5.jpg','assets/images/products/industrial/ecosolv-1.jpg'],
    heroColor: '#1D2840',
    description: 'LabPure Grade A is a line of high-purity laboratory reagents and analytical chemicals supplied for quality control laboratories, research institutions, and industrial testing applications. Each batch is accompanied by a Certificate of Analysis.',
    specs: [
      {label:'Grade',value:'AR (Analytical Reagent)'},{label:'Purity',value:'99.5% min.'},
      {label:'Packaging',value:'Amber glass / HDPE'},{label:'Documentation',value:'CoA with every batch'},
      {label:'Pack Sizes',value:'500ml · 1L · 5L'},{label:'Storage',value:'Per SDS (product specific)'},
      {label:'Shelf Life',value:'Product dependent'},{label:'Standards',value:'IP / BP / ACS grade available'}
    ],
    applications: [
      {icon:'🔬',title:'Research Labs',desc:'Consistent grade for reproducible research results.'},
      {icon:'✅',title:'Quality Control',desc:'Reliable reference standards for QC workflows.'},
      {icon:'🏭',title:'Industrial Testing',desc:'In-process and finished goods analysis.'}
    ],
    related: ['labglass-essentials','cleanpro-industrial','spocochem-pro']
  },
  {
    id: 'labglass-essentials', name: 'LabGlass Essentials',
    tagline: 'Durable glassware for routine testing and scientific work.',
    category: 'lab', categoryLabel: 'Glassware',
    purity: 'Durable', base: 'Glassware',
    packSizes: ['Sets', 'Individual'],
    images: ['assets/images/products/lab/labglass-1.jpg','assets/images/products/lab/labglass-2.jpg','assets/images/products/lab/labpure-1.jpg','assets/images/products/agro/agroprime-3.jpg','assets/images/products/industrial/ecosolv-1.jpg'],
    heroColor: '#222D40',
    description: 'LabGlass Essentials brings together a curated range of laboratory glassware for daily use in quality control, academic, and industrial laboratory settings. Borosilicate glass (Type I) conforming to ISO and DIN specifications.',
    specs: [
      {label:'Glass Type',value:'Borosilicate (Type I)'},{label:'Standards',value:'ISO 3819 / DIN 12331'},
      {label:'Calibration',value:'Class A volumetric available'},{label:'Supply Format',value:'Individual or set packs'},
      {label:'MOQ',value:'No minimum'},{label:'Customisation',value:'Logo etching on request'},
      {label:'Range',value:'Beakers, flasks, cylinders, burettes'},{label:'Delivery',value:'Foam-lined packaging'}
    ],
    applications: [
      {icon:'🔬',title:'Academic Labs',desc:'Durable glassware for teaching and research.'},
      {icon:'📊',title:'QC Laboratories',desc:'Volumetric and analytical glassware.'},
      {icon:'🏭',title:'Industrial Labs',desc:'Routine testing and sample processing.'}
    ],
    related: ['labpure-grade-a','cleanpro-industrial','spocochem-pro']
  },
  {
    id: 'colorfresh-food-dye', name: 'ColorFresh Food Dye',
    tagline: 'Food colour for confectionery, beverages, and processed foods.',
    category: 'food', categoryLabel: 'Food Colour',
    purity: 'Food grade', base: 'Food colour',
    packSizes: ['100g', '1kg'],
    images: ['assets/images/products/food/colorfresh-1.jpg','assets/images/products/food/colorfresh-2.jpg','assets/images/products/pgr/bloompro-1.jpg','assets/images/products/fertilizer/solufeed-1.jpg','assets/images/products/agro/agroprime-3.jpg'],
    heroColor: '#3D1C2A',
    description: 'ColorFresh Food Dye is a range of food-grade colouring agents produced under strict food safety manufacturing conditions and compliant with FSSAI, EU, and international food additive standards. Excellent stability under heat and light conditions.',
    specs: [
      {label:'Grade',value:'Food Grade (FSSAI compliant)'},{label:'Form',value:'Fine powder'},
      {label:'Solubility',value:'Water soluble / Fat soluble (range)'},{label:'Heat Stability',value:'Up to 180°C'},
      {label:'Pack Sizes',value:'100g · 1kg'},{label:'Shelf Life',value:'24 months sealed'},
      {label:'Colours Available',value:'Full spectrum — contact for list'},{label:'Standards',value:'FSSAI, INS compliant'}
    ],
    applications: [
      {icon:'🍬',title:'Confectionery',desc:'Hard candy, gummies, and chocolate coatings.'},
      {icon:'🥤',title:'Beverages',desc:'Soft drinks, juices, and flavoured water.'},
      {icon:'🍰',title:'Bakery',desc:'Icings, fillings, and decorative applications.'}
    ],
    related: ['freshguard-preserve','labpure-grade-a','solufeed-wsf']
  },
  {
    id: 'freshguard-preserve', name: 'FreshGuard Preserve',
    tagline: 'Food preservative solution to improve shelf life and stability.',
    category: 'food', categoryLabel: 'Preservative',
    purity: 'Shelf-life support', base: 'Stability',
    packSizes: ['500g', '5kg'],
    images: ['assets/images/products/food/freshguard-1.jpg','assets/images/products/food/colorfresh-1.jpg','assets/images/products/food/colorfresh-2.jpg','assets/images/products/fertilizer/solufeed-1.jpg','assets/images/products/agro/agroprime-3.jpg'],
    heroColor: '#3D2A1C',
    description: 'FreshGuard Preserve is a multi-functional food preservation compound that combines antimicrobial action with antioxidant stabilisation to extend the shelf life of processed food products. GRAS-compliant ingredients including potassium sorbate and sodium benzoate.',
    specs: [
      {label:'Active Components',value:'Potassium sorbate + antioxidant blend'},{label:'Form',value:'Powder blend'},
      {label:'Dosage',value:'0.05–0.2% of product weight'},{label:'pH Range',value:'4.0 – 7.0 (optimal)'},
      {label:'Pack Sizes',value:'500g · 5kg'},{label:'Shelf Life',value:'24 months sealed'},
      {label:'Compliance',value:'FSSAI, GRAS, INS compliant'},{label:'Applications',value:'Bakery, sauces, dairy-adjacent'}
    ],
    applications: [
      {icon:'🥐',title:'Bakery Products',desc:'Yeast and mould control in bread and pastry.'},
      {icon:'🥫',title:'Sauces & Pickles',desc:'Extended shelf life for acidic condiments.'},
      {icon:'🧀',title:'Dairy-Adjacent',desc:'Stabilisation in cheese analogs and spreads.'}
    ],
    related: ['colorfresh-food-dye','labpure-grade-a','spocochem-pro']
  }
];

const WFBC_CATEGORIES = [
  {id:'all',label:'All Products',count:12},
  {id:'agro',label:'Agro Chemicals',count:2},
  {id:'pgr',label:'PGR',count:1},
  {id:'fertilizer',label:'Fertilizers',count:1},
  {id:'industrial',label:'Industrial',count:4},
  {id:'lab',label:'Lab & Glassware',count:2},
  {id:'food',label:'Food Grade',count:2}
];

function getProductById(id){return WFBC_PRODUCTS.find(p=>p.id===id)||null;}
function getRelated(ids){return ids.map(id=>WFBC_PRODUCTS.find(p=>p.id===id)).filter(Boolean);}
