
const ROOT = document.querySelector(':root');

const CONFIG = {
    settings: {
        frame_delay: 5,
        gravity_scale: 1,
        elasticity: 0.1,
        friction: 0.001,

        step: 0.05,
        small_step: 0.0002,
        width: 5.5,
        angle_tolerance: 0.0015,
        verif_pixel_tolerance: 2,
        
        function_transition_duration: 0.5,
        box_transition_duration: 0.22,
        auto_scroll_speed: 1.2,

        function_colors: ["rgb(245, 0, 0)", "rgb(0, 0, 245)", "rgb(0, 170, 0)", "rgb(255, 165, 0)", "rgb(172, 43, 227)", "rgb(0, 138, 138)"]
    },
    levels: [
        {  // ------------------------------------------- Chapter 1 | Level 1 -------------------------------------------
            chapter_number: 1, level_number: 1,
            tooltip: { title: "Box", subtitle: "Drag and drop to move boxes", img: "level1.png", width: 220, height: 92 },
            winning_functions: ["x+4"],
            custom_classes: ["no_function_color"],
            sections: [
                { type: "y_function", boxes: "x"},
                {type: "bank", boxes: "+/4"}
            ]
        }, // ------------------------------------------- Chapter 1 | Level 1 -------------------------------------------
        {  // ------------------------------------------- Chapter 1 | Level 2 -------------------------------------------
            chapter_number: 1, level_number: 2,
            tooltip: { title: "Linear Function", subtitle: "A is the slope, B is intercept!", img: "level2.png", width: 280, height: 0 },
            winning_functions: ["2*x-3"],
            custom_classes: ["no_function_color"],
            sections: [
                { type: "y_function_locked", text: "ax + b", value: "(a*x)+b" },
                { type: "constant_slider", letter: "a", min: -3, max: 3, default: 0},
                { type: "constant_slider", letter: "b", min: -3, max: 3, default: 0},
            ]
        }, // ------------------------------------------- Chapter 1 | Level 2 -------------------------------------------
        {  // ------------------------------------------- Chapter 1 | Level 3 -------------------------------------------
            chapter_number: 1, level_number: 3,
            tooltip: { title: "Multiplication", subtitle: "Two boxes side by side are multiplied", img: "level3.png", width: 265, height: 77 },
            winning_functions: ["-2*x+4"],
            custom_classes: ["no_function_color"],
            sections: [
                { type: "y_function_locked", text: "ax + b", value: "(a*x)+b" },
                { type: "constant", letter: "a", boxes: "[fs]1[fm]2[fe]"},
                { type: "constant", letter: "b", boxes: "2" },
                { type: "bank", boxes: "-3/-2/3/2"}
            ]
        }, // ------------------------------------------- Chapter 1 | Level 3 -------------------------------------------
        {  // ------------------------------------------- Chapter 1 | Level 4 -------------------------------------------
            chapter_number: 1, level_number: 4,
            tooltip: { title: "Box", subtitle: "Drag and drop to move boxes", img: "level1.png", width: 220, height: 92 },
            winning_functions: ["-2*x+3"],
            custom_classes: ["no_function_color"],
            sections: [
                { type: "y_function", boxes: "x/+" },
                { type: "bank", boxes: "2/-/3/+/7"}
            ]
        }, // ------------------------------------------- Chapter 1 | Level 4 -------------------------------------------
        {  // ------------------------------------------- Chapter 1 | Level 5 -------------------------------------------
            chapter_number: 1, level_number: 5,
            tooltip: { title: "Red Boxes", subtitle: "Red Boxes are bounded to their function.<br>They can't be moved outside of it.", img: "level1.png", width: 220, height: 0 },
            winning_functions: ["x"],
            custom_classes: ["no_function_color"],
            sections: [
                { type: "y_function", boxes: "x/+/[b]5" },
                { type: "bank", boxes: "2/-/3/+/7"}
            ]
        }, // ------------------------------------------- Chapter 1 | Level 5 -------------------------------------------
        {  // ------------------------------------------- Chapter 1 | Level 6 -------------------------------------------
            chapter_number: 1, level_number: 6,
            tooltip: { title: "Change A", subtitle: "A is the slope of both functions,<br>and both function have the same slope!", img: "level1.png", width: 220, height: 0 },
            winning_functions: ["2*x-1","2*x+4"],
                sections: [
                    { type: "y_function", boxes: "[b]ax/+/3" },
                    { type: "y_function", boxes: "[b]ax"},
                    { type: "constant", letter: "a", boxes: "1" },
                    { type: "bank", boxes: "4/-/2"}
                ]
        }, // ------------------------------------------- Chapter 1 | Level 6 -------------------------------------------
        {  // ------------------------------------------- Chapter 1 | Level 7 -------------------------------------------
                chapter_number: 1, level_number: 7,
                tooltip: { title: "The intercept B", subtitle: "One function has B as its intercept.<br>The other must have 2*B then?", img: "level1.png", width: 220, height: 0 },
                winning_functions: ["3*x+3","0.5*x-6"],
                sections: [
                    { type: "y_function", boxes: "[b]x/[b]+/[b]b" },
                    { type: "y_function", boxes: "[b]x/[b]-/[b]b"},
                    { type: "constant_slider", letter: "b", min: 1, max: 5, default: 2},
                    { type: "bank", boxes: "[fs]1[fm]2[fe]/2/3"}
                ]
        }, // ------------------------------------------- Chapter 1 | Level 7 -------------------------------------------
        {  // ------------------------------------------- Chapter 1 | Level 8 -------------------------------------------
            chapter_number: 1, level_number: 8,
            tooltip: { title: "Good Luck!", subtitle: "No hint for this level :)", img: "level1.png", width: 220, height: 0 },
            winning_functions: ["-6*x+7","1/2*x-2"],
            sections: [
                { type: "y_function", boxes: "[b]x/+/4"},
                { type: "y_function", boxes: "[b]x/+"},
                { type: "bank", boxes: "-3/-2/[fs]1[fm]2[fe]/2/5/7"}
            ]
        }, // ------------------------------------------- Chapter 1 | Level 8 -------------------------------------------
        {  // ------------------------------------------- Chapter 1 | Level 9 -------------------------------------------
            chapter_number: 1, level_number: 9,
            tooltip: { title: "Degree 2", subtitle: "x^2 is equal to x*x", img: "level1.png", width: 220, height: 0 },
            winning_functions: ["x**2","0-(x)**2"],
            sections: [
                { type: "y_function", boxes: ""},
                { type: "y_function", boxes: ""},
                { type: "bank", boxes: "x/+/x[^s]2[^e]/-/x"}
            ]
        }, // ------------------------------------------- Chapter 1 | Level 9 -------------------------------------------
        {  // ------------------------------------------- Chapter 1 | Level 10 -------------------------------------------
            chapter_number: 1, level_number: 10,
            tooltip: { title: "SIN and COS", subtitle: "SIN starts at its middle.<br>COS starts at its higher.", img: "level1.png", width: 220, height: 0 },
            winning_functions: ["2*Math.cos(x)+3","4*Math.sin(x)-3"],
            sections: [
                { type: "y_function", boxes: "3/[b]cos(x)" },
                { type: "y_function", boxes: "[b]sin(x)"},
                { type: "bank", boxes: "[fs]1[fm]2[fe]/+/2/4/-/5/6"}
            ]
        }, // ------------------------------------------- Chapter 1 | Level 10 -------------------------------------------
        {  // ------------------------------------------- Chapter 2 | Level 1 -------------------------------------------
            chapter_number: 2, level_number: 1,
            tooltip: { title: "Golf", subtitle: "Hit the PLAY button near the top right!", img: "level1.png", width: 220, height: 0 },
            custom_classes: ["no_function_color"],
            balls: [
                { pos_x: 560,  pos_y: 200, vel_x: 0,  vel_y: 0,  grav_x: 0, grav_y: 1, radius: 20, color: "rgb(245, 245, 245)", id: 1 }
            ],
            holes: [
                { pos_x: 1300, pos_y: 680, radius: 45, color: "rgb(190, 190, 190)", id: 1 }
            ],
            sections: [
                { type: "y_function_locked", text: "x / a", value: "(x/a)" },
                { type: "constant_slider", letter: "a", min: -3, max: 3, default: 0.5, step: 0.1}
            ]
        }, // ------------------------------------------- Chapter 2 | Level 1 -------------------------------------------
        {  // ------------------------------------------- Chapter 2 | Level 2 -------------------------------------------
            chapter_number: 2, level_number: 2,
            tooltip: { title: "Golf", subtitle: "Hit the PLAY button near the top right!", img: "level1.png", width: 220, height: 0 },
            custom_classes: ["no_function_color"],
            balls: [
                { pos_x: 560,  pos_y: 200, vel_x: 0,  vel_y: 0,  grav_x: 0, grav_y: 1, radius: 20, color: "rgb(245, 245, 245)", id: 1 }
            ],
            holes: [
                { pos_x: 1300, pos_y: 450, radius: 45, color: "rgb(190, 190, 190)", id: 1 }
            ],
            sections: [
                { type: "y_function", boxes: "[b]x/+" },
                { type: "bank", boxes: "2/-/3/4/[fs]1[fm]3[fe]/[fs]1[fm]2[fe]/[fs]1[fm]4[fe]/6/[fs]1[fm]10[fe]"}
            ]
        },// ------------------------------------------- Chapter 2 | Level 2 -------------------------------------------
        {  // ------------------------------------------- Chapter 2 | Level 3 -------------------------------------------
            chapter_number: 2, level_number: 3,
            tooltip: { title: "Unwanted Function", subtitle: "Try to remove the BLUE function from the screen!", img: "level1.png", width: 220, height: 0 },
            balls: [
                { pos_x: 500,  pos_y: 200, vel_x: 0,  vel_y: 0,  grav_x: 0, grav_y: 1, radius: 20, color: "rgb(245, 245, 245)", id: 1 },
                { pos_x: 1420,  pos_y: 200, vel_x: 0,  vel_y: 0,  grav_x: 0, grav_y: 1, radius: 20, color: "rgb(245, 245, 245)", id: 1 }
            ],
            holes: [
                { pos_x: 960, pos_y: 885, radius: 45, color: "rgb(190, 190, 190)", id: 1 }
            ],
            sections: [
                { type: "y_function_locked", text: "-cos(x) - 7", value: "-0.4*ccos(x)-7" },
                { type: "y_function", boxes: "[b]1"},
                { type: "bank", boxes: "2/+/3/-/4"}
            ]
        }, // ------------------------------------------- Chapter 2 | Level 3 -------------------------------------------
        {  // ------------------------------------------- Chapter 2 | Level 4 -------------------------------------------
            chapter_number: 2, level_number: 4,
            tooltip: { title: "Walls", subtitle: "Grey zones are WALLs and they block the ball!", img: "level1.png", width: 220, height: 0 },
            custom_classes: ["no_function_color"],
            balls: [
                { pos_x: 485,  pos_y: 202, vel_x: 0,  vel_y: 0,  grav_x: 0, grav_y: 1, radius: 20, color: "rgb(245, 245, 245)", id: 1 }
            ],
            holes: [
                { pos_x: 1275, pos_y: 560, radius: 45, color: "rgb(190, 190, 190)", id: 1 }
            ],
            zones: [
                { type: "wall", verticies: [ [900, -100], [1020, -100], [1020, 800], [900, 800] ] }
            ],
            sections: [
                { type: "y_function", boxes: "-/[fs]1[fm]6[fe]/x"},
                { type: "bank", boxes: "x[^s]2[^e]/8"}
            ]
        }, // ------------------------------------------- Chapter 2 | Level 4 -------------------------------------------
        {  // ------------------------------------------- Chapter 2 | Level 5 -------------------------------------------
            chapter_number: 2, level_number: 5,
            tooltip: { title: "Walls", subtitle: "Grey zones are WALLs and they block the ball!", img: "level1.png", width: 220, height: 0 },
            balls: [
                { pos_x: 420,  pos_y: 100, vel_x: 0,  vel_y: 2, grav_x: 0, grav_y: 1, radius: 20, color: "rgb(245, 245, 245)", id: 1 },
            ],
            zones: [
                { type: "wall", verticies: [ [830, -100], [1100, -100], [1100, 920], [830, 920] ] }
            ],
            holes: [
                { pos_x: 1600, pos_y: 936, radius: 45, color: "rgb(190, 190, 190)", id: 1},
            ],
            sections: [
                { type: "y_function", boxes: "[b]x"},
                { type: "y_function", boxes: "[b]-x"},
                { type: "bank", boxes: "[fs]1[fm]8[fe]/-/2/3/+/4/-/9"}
            ]
        }, // ------------------------------------------- Chapter 2 | Level 5 -------------------------------------------
        {  // ------------------------------------------- Chapter 2 | Level 6  -------------------------------------------
            chapter_number: 2, level_number: 6,
            tooltip: { title: "Walls", subtitle: "Grey zones are WALLs and they block the ball!", img: "level1.png", width: 220, height: 0 },
            balls: [
                { pos_x: 370,  pos_y: 100, vel_x: 0,  vel_y: 0, grav_x: 0, grav_y: 1, radius: 20, color: "rgb(255, 205, 205)", id: 2 },
                { pos_x: 370, pos_y: 660, vel_x: 0, vel_y: 0, grav_x: 0, grav_y: 1, radius: 20, color: "rgb(205, 205, 255)", id: 3 }
            ],
            holes: [
                { pos_x: 1700, pos_y: 400, radius: 45, color: "rgb(255, 205, 205)", id: 2 },
                { pos_x: 1600, pos_y: 936, radius: 45, color: "rgb(205, 205, 255)", id: 3 },
            ],
            zones: [
                { type: "wall", verticies: [ [1050, -100], [1050, 460], [1200, 460], [1200, -100] ] },
            ],
            sections: [
                { type: "y_function", boxes: "[b]x/-[b]/2"},
                { type: "y_function", boxes: "[b]x"},
                { type: "y_function", boxes: "-[b]/[b]x"},
                { type: "bank", boxes: "[fs]1[fm]2[fe]/[fs]1[fm]5[fe]/[fs]1[fm]4[fe]/+/[fs]1[fm]8[fe]/2/-/3/4/+/5/6"}
            ]
        }, // ------------------------------------------- Chapter 2 | Level 6 -------------------------------------------
        {  // ------------------------------------------- Chapter 2 | Level 7 -------------------------------------------
            chapter_number: 2, level_number: 7,
            tooltip: { title: "Gravity", subtitle: "Blue zones are ANTI-GRAVITY", img: "level1.png", width: 220, height: 0 },
            balls: [
                { pos_x: 260,  pos_y: 200, vel_x: 0,  vel_y: 0,  grav_x: 0, grav_y: 1, radius: 20, color: "rgb(245, 245, 245)", id: 1 }
            ],
            holes: [
                { pos_x: 1150, pos_y: 620, radius: 45, color: "rgb(190, 190, 190)", id: 1 }
            ],
            zones: [
                { type: "wall", verticies: [ [700, 1200], [800, 1200], [800, 920], [700, 920] ] },
                { type: "wall", verticies: [ [700, -100], [800, -100], [800, 720], [700, 720] ], invisible: true },
                { type: "wall", verticies: [ [1050, 1200], [950, 1200], [950, 350], [1050, 350] ] },
                { type: "wall", verticies: [ [800, -200], [1200, -550], [1200, -100], [800, 250] ], invisible: true },
                { type: "grav", verticies: [ [810, 350], [940, 350], [940, 1200], [810, 1200] ] },
                { type: "wall", verticies: [ [700, -100], [1200, -550], [1200, -100], [800, 250], [800, 720], [700, 720] ], no_hitbox: true }
            ],
            sections: [
                { type: "y_function", boxes: "[b]-x"},
                { type: "y_function", boxes: "[b]x" },
                { type: "bank", boxes: "[fs]1[fm]2[fe]/-/3/6/-/+/2/-/7/-/4"}
            ]
        }, // ------------------------------------------- Chapter 2 | Level 7 -------------------------------------------
        {  // ------------------------------------------- Chapter 2 | Level 8 -------------------------------------------
            chapter_number: 2, level_number: 8,
            tooltip: { title: "Lava", subtitle: "Red zones are LAVA", img: "level1.png", width: 220, height: 0 },
            balls: [
                { pos_x: 420,  pos_y: 324, vel_x: 0,  vel_y: 0,  grav_x: 0, grav_y: 1, radius: 20, color: "rgb(245, 245, 245)", id: 1 }
            ],
            holes: [
                { pos_x: 1100, pos_y: 1000, radius: 45, color: "rgb(190, 190, 190)", id: 1 }
            ],
            zones: [
                { type: "wall", verticies: [ [700, 1200], [800, 1200], [800, 920], [700, 920] ] },
                { type: "wall", verticies: [ [700, -100], [800, -100], [800, 720], [700, 720] ], invisible: true },
                { type: "wall", verticies: [ [1050, 1200], [950, 1200], [950, 350], [1050, 350] ] },
                { type: "wall", verticies: [ [800, -200], [1200, -550], [1200, -100], [800, 250] ], invisible: true },
                { type: "grav", verticies: [ [810, 350], [940, 350], [940, 1200], [810, 1200] ] },
                { type: "lava", verticies: [ [700, -485], [2000, -50], [2000, 500], [700, 65] ] },
                { type: "wall", verticies: [ [700, -100], [1200, -550], [1200, -100], [800, 250], [800, 720], [700, 720] ], no_hitbox: true }
            ],
            sections: [
                { type: "y_function", boxes: "[b][fs]x[fm]3[fe]"},
                { type: "y_function", boxes: "[b]-x" },
                { type: "y_function", boxes: "[b]x"},
                { type: "bank", boxes: "[fs]1[fm]2[fe]/-/2/+/3/-/4/+/6/-/7/-/9"}
            ]
        }, // ------------------------------------------- Chapter 2 | Level 8 -------------------------------------------
        {  // ------------------------------------------- Chapter 2 | Level 9 -------------------------------------------
            chapter_number: 2, level_number: 9,
            tooltip: { title: "Good Luck!", subtitle: "No hint for this level :)", img: "level1.png", width: 220, height: 0 },
            balls: [
                { pos_x: 310,  pos_y: 490, vel_x: 0,  vel_y: 0,  grav_x: 0, grav_y: 1, radius: 20, color: "rgb(245, 245, 245)", id: 1 }
            ],
            holes: [
                { pos_x: 1650, pos_y: 525, radius: 45, color: "rgb(190, 190, 190)", id: 1 }
            ],
            zones: [
                { type: "wall", verticies: [ [500, 1200], [600, 1200], [600, 820], [500, 820] ] },
                { type: "wall", verticies: [ [500, 600], [600, 600], [600, 0], [500, 0] ] },

                { type: "wall", verticies: [ [700, 1200], [800, 1200], [800, 520], [700, 520] ] },
                { type: "wall", verticies: [ [700, 400], [800, 400], [800, 0], [700, 0] ] },

                { type: "wall", verticies: [ [1050, 1200], [1150, 1200], [1150, 980], [1050, 980] ] },
                { type: "wall", verticies: [ [1050, 840], [1150, 840], [1150, 0], [1050, 0] ] },
                
                { type: "wall", verticies: [ [1500, 1200], [1600, 1200], [1600, 620], [1500, 620] ] },
                { type: "wall", verticies: [ [1500, 300], [1600, 300], [1600, 0], [1500, 0] ] },

                { type: "grav", verticies: [ [500, 0], [750, 0], [750, 1200], [500, 1200] ] },
                { type: "grav", verticies: [ [1050, 0], [1580, 0], [1580, 1200], [1050, 1200] ] },
                
            ],
          
            sections: [
                { type: "y_function_locked", text: "x<sup>5</sup>", value: "-1/100*(x+9)**5-4"},
                { type: "y_function", boxes: "[b][fs]x[fm]8[fe]" },
                { type: "y_function", boxes: "[b]x"},
                { type: "y_function", boxes: "[b]-x"},
                { type: "bank", boxes: "[fs]3[fm]4[fe]/-/3/4/[fs]1[fm]4[fe]/8/[fs]-1[fm]8[fe]/+/2/-/-/[fs]1[fm]2[fe]/+/6/5/+"}
                
            ]
        }, // ------------------------------------------- Chapter 2 | Level 9 -------------------------------------------
        {  // ------------------------------------------- Chapter 2 | Level 10 -------------------------------------------
            chapter_number: 2, level_number: 10,
            tooltip: { title: "EMP", subtitle: "Purple zones are EMP.<br>They prevent functions from being plotted.", img: "level1.png", width: 220, height: 0 },
            custom_classes: ["no_function_color"],
            balls: [
                { pos_x: 440,  pos_y: 200, vel_x: 0,  vel_y: 0,  grav_x: 0, grav_y: 1, radius: 20, color: "rgb(245, 245, 245)", id: 1 }
            ],
            holes: [
                { pos_x: 1440, pos_y: 780, radius: 45, color: "rgb(190, 190, 190)", id: 1 }
            ],
            zones: [
                { type: "emp", verticies: [ [1100, -100], [1100, 1100], [1250, 1100], [1250, -100] ] },
            ],
            sections: [
                { type: "y_function", boxes: "-/[b][fs]x[fm]6[fe]/-/4"},
                { type: "bank", boxes: "2/+/3"}
            ]
        }, // ------------------------------------------- Chapter 2 | Level 10 -------------------------------------------
        {  // ------------------------------------------- Chapter 2 | Level 11 -------------------------------------------
            chapter_number: 2, level_number: 11,
            tooltip: { title: "EMP", subtitle: "Purple zones are EMP.<br>They prevent functions from being plotted.", img: "level1.png", width: 220, height: 0 },
            balls: [
                { pos_x: 440,  pos_y: 270, vel_x: 0,  vel_y: 0,  grav_x: 0, grav_y: 1, radius: 20, color: "rgb(245, 245, 245)", id: 1 }
            ],
            holes: [
                { pos_x: 1600, pos_y: 810, radius: 45, color: "rgb(190, 190, 190)", id: 1 }
            ],
            zones: [
                { type: "wall", verticies: [ [1100, -100], [1100, 700], [1250, 700], [1250, -100] ] },
                { type: "emp", verticies: [ [1100, 704], [1100, 1100], [1250, 1100], [1250, 704] ] },
            ],
            sections: [
                { type: "y_function", boxes: "-/[b][fs]x[fm]8[fe]/-/4"},
                { type: "bank", boxes: "x/+/2/3"}
            ]
        }, // ------------------------------------------- Chapter 2 | Level 11 -------------------------------------------
        {  // ------------------------------------------- Chapter 2 | Level 12 -------------------------------------------
            chapter_number: 2, level_number: 12,
            tooltip: { title: "Good Luck!", subtitle: "No hint for this level :)", img: "level1.png", width: 220, height: 0 },
            balls: [
                { pos_x: 420,  pos_y: 130, vel_x: 0,  vel_y: 0,  grav_x: 0, grav_y: 1, radius: 20, color: "rgb(245, 245, 245)", id: 1 }
            ],
            holes: [
                { pos_x: 1600, pos_y: 810, radius: 45, color: "rgb(190, 190, 190)", id: 1 }
            ],
            zones: [
                { type: "emp", verticies: [ [1050, -100], [1050, 876], [1270, 876], [1270, -100] ] },
                { type: "lava", verticies: [ [-100, 1200], [2000, 1200], [2000, 880], [-100, 880] ] },
            ],
            sections: [
                { type: "y_function_locked", text: "x<sup>5</sup>", value: "-1/1000*(x+4.8)**5+1"},
                { type: "y_function_locked", text: "(x-h)<sup>5</sup>+k", value: "((x-(h))**2)/8.5+k"},
                { type: "constant", letter: "h", boxes: "[fs]1[fm]2[fe]"},
                { type: "constant", letter: "k", boxes: "2" },
                { type: "bank", boxes: "2/3/-/4/5/+/6/7/-/8"}
            ]
        }, // ------------------------------------------- Chapter 2 | Level 12 -------------------------------------------
    ]
};
