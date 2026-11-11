// Datos de los 4 Paquetes Navideños de Don Facu para la Votación
export const DON_FACU_PACKAGES = [
  {
    id: 'paquete-1',
    packageNumber: 1,
    title: 'Paquete Navideño 1',
    price: 'S/ 50.00',
    priceNum: 50,
    badge: 'Opción Más Económica',
    badgeColor: 'bg-emerald-600',
    highlight: 'Chuleta de cerdo, res o filete de pollo',
    dishes: [
      { label: 'Brindis', item: 'Copa de sangría' },
      { label: 'Bebida', item: 'Bebida de estación' },
      { label: 'Plato de Fondo', item: 'Chuleta de cerdo, Chuleta de res o Filete de pollo' },
      { label: 'Guarnición', item: 'Papa frita o grillada + ensalada de la casa' },
      { label: 'Postre', item: 'Tres leches navideño' }
    ],
    selectableOptions: [
      {
        id: 'mainDish',
        label: 'Elige tu Plato de Fondo',
        options: ['Chuleta de cerdo', 'Chuleta de res', 'Filete de pollo'],
        defaultOption: 'Chuleta de cerdo'
      },
      {
        id: 'sideDish',
        label: 'Elige tu Guarnición',
        options: ['Papas fritas + ensalada', 'Papas grilladas + ensalada'],
        defaultOption: 'Papas fritas + ensalada'
      }
    ]
  },
  {
    id: 'paquete-2',
    packageNumber: 2,
    title: 'Paquete Navideño 2',
    price: 'S/ 55.00',
    priceNum: 55,
    badge: 'Ahumados Clásicos',
    badgeColor: 'bg-amber-600',
    highlight: 'Panceta ahumada o Bondiola ahumada',
    dishes: [
      { label: 'Brindis', item: 'Copa de sangría' },
      { label: 'Bebida', item: 'Bebida de estación o Agua' },
      { label: 'Plato de Fondo', item: 'Panceta ahumada o Bondiola ahumada' },
      { label: 'Guarnición', item: 'Puré de camote, Arroz árabe y Ensalada de fideos' },
      { label: 'Postre', item: 'Tres leches navideño' }
    ],
    selectableOptions: [
      {
        id: 'mainDish',
        label: 'Elige tu Plato de Fondo',
        options: ['Panceta ahumada', 'Bondiola ahumada'],
        defaultOption: 'Panceta ahumada'
      },
      {
        id: 'drink',
        label: 'Elige tu Bebida',
        options: ['Bebida de estación', 'Agua mineral'],
        defaultOption: 'Bebida de estación'
      },
      {
        id: 'sideDish',
        label: 'Elige tu Guarnición',
        options: [
          'Puré de camote + Arroz árabe + Ensalada de fideos',
          'Clásica (Papa frita + ensalada de la casa)'
        ],
        defaultOption: 'Puré de camote + Arroz árabe + Ensalada de fideos'
      }
    ]
  },
  {
    id: 'paquete-3',
    packageNumber: 3,
    title: 'Paquete Navideño 3',
    price: 'S/ 65.00',
    priceNum: 65,
    badge: 'Cortes Selectos',
    badgeColor: 'bg-[#01ACAD]',
    highlight: 'Bife ancho o Bife angosto',
    dishes: [
      { label: 'Brindis', item: 'Copa de sangría' },
      { label: 'Bebida', item: 'Bebida de estación, Agua o Gaseosa' },
      { label: 'Plato de Fondo', item: 'Bife ancho o Bife angosto' },
      { label: 'Guarnición', item: 'Puré de camote, Arroz árabe y Ensalada de fideos' },
      { label: 'Postre', item: 'Tres leches navideño' }
    ],
    selectableOptions: [
      {
        id: 'mainDish',
        label: 'Elige tu Corte de Carne',
        options: ['Bife ancho', 'Bife angosto'],
        defaultOption: 'Bife ancho'
      },
      {
        id: 'drink',
        label: 'Elige tu Bebida',
        options: ['Bebida de estación', 'Agua mineral', 'Gaseosa'],
        defaultOption: 'Bebida de estación'
      },
      {
        id: 'sideDish',
        label: 'Elige tu Guarnición',
        options: [
          'Puré de camote + Arroz árabe + Ensalada de fideos',
          'Clásica (Papa frita + ensalada de la casa)'
        ],
        defaultOption: 'Puré de camote + Arroz árabe + Ensalada de fideos'
      }
    ]
  },
  {
    id: 'paquete-4',
    packageNumber: 4,
    title: 'Paquete Navideño 4',
    price: 'S/ 90.00',
    priceNum: 90,
    badge: 'Menú Premium con Lomo Fino',
    badgeColor: 'bg-[#002559]',
    highlight: 'Lomo fino 150g + Bondiola + Empanada argentina',
    dishes: [
      { label: 'Brindis', item: 'Copa de sangría o Copa de vino' },
      { label: 'Entrada', item: 'Empanada argentina' },
      { label: 'Plato de Fondo', item: 'Medallón de bondiola + Lomo fino 150 gr' },
      { label: 'Guarnición', item: 'Puré de camote, Arroz árabe y Ensalada de fideos (o Papas fritas / grilladas + ensalada)' },
      { label: 'Bebida', item: 'Agua o Gaseosa personal' },
      { label: 'Postre', item: 'Tres leches navideño' }
    ],
    selectableOptions: [
      {
        id: 'toast',
        label: 'Elige tu Brindis',
        options: ['Copa de vino', 'Copa de sangría'],
        defaultOption: 'Copa de vino'
      },
      {
        id: 'drink',
        label: 'Elige tu Bebida',
        options: ['Gaseosa personal', 'Agua personal'],
        defaultOption: 'Gaseosa personal'
      },
      {
        id: 'sideDish',
        label: 'Elige tu Guarnición',
        options: [
          'Puré de camote + Arroz árabe + Ensalada de fideos',
          'Papas fritas + ensalada de la casa',
          'Papas grilladas + ensalada de la casa'
        ],
        defaultOption: 'Puré de camote + Arroz árabe + Ensalada de fideos'
      }
    ]
  }
];
