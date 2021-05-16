// const FIELD_SYMBOLS = {
//     ledState: {
//         type: 'byte',
//         values: { on: 1, off: 0 }
//     }
// };

// const BLOCK_SYMBOLS = {
//     byte: {
//         byte: 1
//     },
//     num: {
//         byte: 2
//     },
//     list: {
//         byte: 3
//     },
//     event_whenflagclicked: {
//         type: 'hat'
//     },
//     control_stop: {
//         type: 'prim',
//         byte: 11
//     },
//     control_repeat: {
//         type: 'prim',
//         byte: 13
//     },
//     control_forever: {
//         type: 'prim',
//         byte: 14
//     },
//     control_wait_until: {
//         type: 'prim',
//         byte: 17
//     },
//     control_repeat_until: {
//         type: 'prim',
//         byte: 18
//     },
//     control_waitms: {
//         type: 'prim',
//         byte: 38,
//         args: [
//             {
//                 type: 'NUM',
//                 shadow: 'math_positive_number'
//             }
//         ]
//     },
//     data_setvariableto: {
//         type: 'prim',
//         byte: 33
//     },
//     data_variable: {
//         type: 'prim',
//         byte: 34
//     },
//     data_changevariableby: {
//         type: 'prim',
//         byte: 35
//     },
//     operator_add: {
//         type: 'prim',
//         byte: 20
//     },
//     operator_subtract: {
//         type: 'prim',
//         byte: 21
//     },
//     operator_multiply: {
//         type: 'prim',
//         byte: 22
//     },
//     operator_divide: {
//         type: 'prim',
//         byte: 23
//     },
//     operator_mod: {
//         type: 'prim',
//         byte: 24
//     },
//     operator_gt: {
//         type: 'prim',
//         byte: 27
//     },
//     operator_lt: {
//         type: 'prim',
//         byte: 28
//     },
//     operator_not: {
//         type: 'prim',
//         byte: 32
//     },
//     operator_random: {
//         type: 'prim',
//         byte: 37
//     },
//     operator_equals: {
//         type: 'prim',
//         byte: 25
//     },
//     event_whenstarted: {
//         type: 'hat',
//         byte: 0x08
//     },
//     looks_forwardpixel: {
//         type: 'prim',
//         byte: 0x40,
//         args: [
//             {
//                 type: 'NUM',
//                 shadow: 'math_positive_number'
//             }
//         ]
//     },
//     looks_backpixel: {
//         type: 'prim',
//         byte: 0x41,
//         args: [
//             {
//                 type: 'NUM',
//                 shadow: 'math_positive_number'
//             }
//         ]
//     },
//     looks_changecolor: {
//         type: 'prim',
//         byte: 0x42,
//         args: [
//             {
//                 type: 'NUM',
//                 shadow: 'math_integer'
//             }
//         ]
//     },
//     looks_setcolor: {
//         type: 'prim',
//         byte: 0x43,
//         args: [
//             {
//                 type: 'NUM',
//                 shadow: 'math_positive_number'
//             }
//         ]
//     },
//     looks_setallcolors: {
//         type: 'prim',
//         byte: 0x44,
//         args: [
//             {
//                 type: 'NUM',
//                 shadow: 'math_positive_number'
//             }
//         ]
//     }
// };

// export {
//     FIELD_SYMBOLS as FieldSymbols,
//     BLOCK_SYMBOLS as BlockSymbols
// }
