/* =========================================================
   LANDING PAGE
========================================================= */

const greetingEl = document.getElementById("greeting-text");
const nameEl = document.getElementById("name-text");
const btnEl = document.getElementById("know-btn");

const cubeSection = document.getElementById("cube-section");
const closeCube = document.getElementById("close-cube");


/* =========================================================
   TYPING ANIMATION
========================================================= */

const greetingString = "Hi, I'm";
const nameString = "KHUSHI TIRKEY";

let greetingIndex = 0;
let nameIndex = 0;

const typingSpeed = 120;


function typeGreeting() {

    if (greetingIndex < greetingString.length) {

        greetingEl.innerHTML =
            greetingString.substring(
                0,
                greetingIndex + 1
            ) +
            '<span class="cursor"></span>';

        greetingIndex++;

        setTimeout(
            typeGreeting,
            typingSpeed
        );

    } else {

        greetingEl.textContent =
            greetingString;

        setTimeout(
            typeName,
            400
        );
    }
}


function typeName() {

    if (nameIndex < nameString.length) {

        nameEl.innerHTML =
            nameString.substring(
                0,
                nameIndex + 1
            ) +
            '<span class="cursor"></span>';

        nameIndex++;

        setTimeout(
            typeName,
            typingSpeed
        );

    } else {

        nameEl.textContent =
            nameString;

        setTimeout(
            () => {

                btnEl.classList.add("visible");

            },
            500
        );
    }
}


window.addEventListener(
    "load",
    () => {

        setTimeout(
            typeGreeting,
            500
        );

    }
);


/* =========================================================
   OPEN CUBE
========================================================= */

let cubeCreated = false;


btnEl.addEventListener(
    "click",
    () => {

        cubeSection.classList.add("active");


        if (!cubeCreated) {

            createRubiksCube();

            cubeCreated = true;
        }

    }
);


/* =========================================================
   CLOSE CUBE
========================================================= */

closeCube.addEventListener(
    "click",
    () => {

        cubeSection.classList.remove("active");

    }
);


/* =========================================================
   CREATE RUBIK'S CUBE
========================================================= */

function createRubiksCube() {

    /*
        Make sure Three.js loaded.
    */

    if (typeof THREE === "undefined") {

        console.error(
            "Three.js is not loaded."
        );

        return;
    }


    const container =
        document.getElementById(
            "cube-container"
        );


    /* =====================================================
       SCENE
    ===================================================== */

    const scene =
        new THREE.Scene();


    /* =====================================================
       CAMERA
    ===================================================== */

    const camera =
        new THREE.PerspectiveCamera(
            35,
            container.clientWidth /
                container.clientHeight,
            0.1,
            100
        );


    /*
        Front-facing starting position.

        Z is positive = front.
    */

    camera.position.set(
        4.2,
        2.2,
        7
    );


    camera.lookAt(
        0,
        0,
        0
    );


    /* =====================================================
       RENDERER
    ===================================================== */

    const renderer =
        new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });


    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            2
        )
    );


    renderer.setSize(
        container.clientWidth,
        container.clientHeight
    );


    container.innerHTML = "";

    container.appendChild(
        renderer.domElement
    );


    /* =====================================================
       LIGHTING
    ===================================================== */

    const ambientLight =
        new THREE.AmbientLight(
            0xffffff,
            2.5
        );


    scene.add(
        ambientLight
    );


    const keyLight =
        new THREE.DirectionalLight(
            0xffffff,
            3
        );


    keyLight.position.set(
        5,
        8,
        10
    );


    scene.add(
        keyLight
    );


    const fillLight =
        new THREE.DirectionalLight(
            0xffffff,
            1.5
        );


    fillLight.position.set(
        -5,
        3,
        5
    );


    scene.add(
        fillLight
    );


    /* =====================================================
       CUBE GROUP
    ===================================================== */

    const cubeGroup =
        new THREE.Group();


    scene.add(
        cubeGroup
    );


    /*
        All 27 small cubes.
    */

    let cubies = [];


    const SIZE = 1;

    const GAP = 0.055;

    const STEP =
        SIZE + GAP;


    /* =====================================================
       COLORS
    ===================================================== */

    const COLORS = {

        front: 0x2eae50,

        back: 0xe53935,

        right: 0x2454ff,

        left: 0xff7417,

        top: 0xffffff,

        bottom: 0xffd928,

        inside: 0x111111

    };


    /* =====================================================
       MATERIAL
    ===================================================== */

    function createMaterial(color) {

        return new THREE.MeshStandardMaterial({

            color: color,

            roughness: 0.28,

            metalness: 0.05

        });

    }


    /* =====================================================
       CREATE ONE CUBIE
    ===================================================== */

    function createCubie(
        x,
        y,
        z
    ) {

        const geometry =
            new THREE.BoxGeometry(
                SIZE,
                SIZE,
                SIZE
            );


        /*
            Three.js material order:

            0 = +X
            1 = -X
            2 = +Y
            3 = -Y
            4 = +Z
            5 = -Z
        */

        const materials = [

            createMaterial(
                x === 1
                    ? COLORS.right
                    : COLORS.inside
            ),

            createMaterial(
                x === -1
                    ? COLORS.left
                    : COLORS.inside
            ),

            createMaterial(
                y === 1
                    ? COLORS.top
                    : COLORS.inside
            ),

            createMaterial(
                y === -1
                    ? COLORS.bottom
                    : COLORS.inside
            ),

            createMaterial(
                z === 1
                    ? COLORS.front
                    : COLORS.inside
            ),

            createMaterial(
                z === -1
                    ? COLORS.back
                    : COLORS.inside
            )

        ];


        const cubie =
            new THREE.Mesh(
                geometry,
                materials
            );


        cubie.position.set(
            x * STEP,
            y * STEP,
            z * STEP
        );


        /*
            Store logical coordinates.
        */

        cubie.userData.x = x;

        cubie.userData.y = y;

        cubie.userData.z = z;


        /*
            Add black edges.
        */

        const edges =
            new THREE.EdgesGeometry(
                geometry
            );


        const edgeMaterial =
            new THREE.LineBasicMaterial({

                color: 0x111111,

                transparent: true,

                opacity: 0.85

            });


        const edgeLines =
            new THREE.LineSegments(
                edges,
                edgeMaterial
            );


        cubie.add(
            edgeLines
        );


        cubeGroup.add(
            cubie
        );


        cubies.push(
            cubie
        );
    }


    /* =====================================================
       BUILD 3 × 3 × 3
    ===================================================== */

    function buildCube() {

        /*
            Remove existing cubes.
        */

        while (
            cubeGroup.children.length > 0
        ) {

            cubeGroup.remove(
                cubeGroup.children[0]
            );

        }


        cubies = [];


        for (
            let x = -1;
            x <= 1;
            x++
        ) {

            for (
                let y = -1;
                y <= 1;
                y++
            ) {

                for (
                    let z = -1;
                    z <= 1;
                    z++
                ) {

                    createCubie(
                        x,
                        y,
                        z
                    );

                }

            }

        }

    }


    buildCube();


    /* =====================================================
       LAYER ROTATION
    ===================================================== */

    let isTurning = false;


    function turnLayer(
        move,
        reverse = false
    ) {

        if (isTurning) {

            return;

        }


        let axis;

        let layer;


        switch (move) {

            case "F":

                axis = "z";
                layer = 1;

                break;


            case "B":

                axis = "z";
                layer = -1;

                break;


            case "R":

                axis = "x";
                layer = 1;

                break;


            case "L":

                axis = "x";
                layer = -1;

                break;


            case "U":

                axis = "y";
                layer = 1;

                break;


            case "D":

                axis = "y";
                layer = -1;

                break;


            default:

                return;
        }


        isTurning = true;


        /*
            Find the 9 cubies in that layer.
        */

        const selected =
            cubies.filter(
                cubie =>
                    cubie.userData[axis] === layer
            );


        /*
            Temporary group.
        */

        const rotationGroup =
            new THREE.Group();


        cubeGroup.add(
            rotationGroup
        );


        /*
            Move selected cubies into
            temporary group.
        */

        selected.forEach(
            cubie => {

                rotationGroup.attach(
                    cubie
                );

            }
        );


        /*
            90 degree rotation.
        */

        const targetAngle =
            reverse
                ? -Math.PI / 2
                : Math.PI / 2;


        const duration = 280;

        const startTime =
            performance.now();


        function animateTurn(
            currentTime
        ) {

            const elapsed =
                currentTime -
                startTime;


            const progress =
                Math.min(
                    elapsed / duration,
                    1
                );


            /*
                Smooth easing.
            */

            const eased =
                1 -
                Math.pow(
                    1 - progress,
                    3
                );


            rotationGroup.rotation[axis] =
                targetAngle *
                eased;


            if (
                progress < 1
            ) {

                requestAnimationFrame(
                    animateTurn
                );

            } else {

                finishTurn(
                    rotationGroup,
                    selected,
                    axis
                );

            }

        }


        requestAnimationFrame(
            animateTurn
        );

    }


    /* =====================================================
       FINISH ROTATION
    ===================================================== */

    function finishTurn(
        rotationGroup,
        selected,
        axis
    ) {

        /*
            Put cubies back into main group.
        */

        selected.forEach(
            cubie => {

                cubeGroup.attach(
                    cubie
                );

            }
        );


        cubeGroup.remove(
            rotationGroup
        );


        /*
            Snap positions.

            This keeps the cube aligned
            to a perfect 3×3 grid.
        */

        selected.forEach(
            cubie => {

                cubie.position.x =
                    Math.round(
                        cubie.position.x /
                        STEP
                    ) * STEP;


                cubie.position.y =
                    Math.round(
                        cubie.position.y /
                        STEP
                    ) * STEP;


                cubie.position.z =
                    Math.round(
                        cubie.position.z /
                        STEP
                    ) * STEP;


                /*
                    Snap rotation too.
                */

                cubie.rotation.x =
                    Math.round(
                        cubie.rotation.x /
                        (Math.PI / 2)
                    ) *
                    (Math.PI / 2);


                cubie.rotation.y =
                    Math.round(
                        cubie.rotation.y /
                        (Math.PI / 2)
                    ) *
                    (Math.PI / 2);


                cubie.rotation.z =
                    Math.round(
                        cubie.rotation.z /
                        (Math.PI / 2)
                    ) *
                    (Math.PI / 2);


                /*
                    Update logical coordinates.
                */

                cubie.userData.x =
                    Math.round(
                        cubie.position.x /
                        STEP
                    );


                cubie.userData.y =
                    Math.round(
                        cubie.position.y /
                        STEP
                    );


                cubie.userData.z =
                    Math.round(
                        cubie.position.z /
                        STEP
                    );

            }
        );


        isTurning = false;

    }


    /* =====================================================
       BUTTON CONTROLS
    ===================================================== */

    const moveButtons =
        document.querySelectorAll(
            "[data-move]"
        );


    moveButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    turnLayer(
                        button.dataset.move
                    );

                }
            );

        }
    );


    /* =====================================================
       KEYBOARD CONTROLS
    ===================================================== */

    const validMoves = [
        "F",
        "B",
        "R",
        "L",
        "U",
        "D"
    ];


    window.addEventListener(
        "keydown",
        event => {

            const key =
                event.key.toUpperCase();


            if (
                validMoves.includes(key)
            ) {

                turnLayer(
                    key,
                    event.shiftKey
                );

            }

        }
    );


    /* =====================================================
       SCRAMBLE
    ===================================================== */

    const scrambleMoves = [
        "F",
        "B",
        "R",
        "L",
        "U",
        "D"
    ];


    function scrambleCube() {

        if (isTurning) {

            return;

        }


        let count = 0;


        function nextMove() {

            if (count >= 20) {

                return;

            }


            const randomMove =
                scrambleMoves[
                    Math.floor(
                        Math.random() *
                        scrambleMoves.length
                    )
                ];


            const reverse =
                Math.random() > 0.5;


            turnLayer(
                randomMove,
                reverse
            );


            count++;


            setTimeout(
                nextMove,
                330
            );

        }


        nextMove();

    }


    document
        .getElementById(
            "scramble-btn"
        )
        .addEventListener(
            "click",
            scrambleCube
        );


    /* =====================================================
       RESET
    ===================================================== */

    document
        .getElementById(
            "reset-btn"
        )
        .addEventListener(
            "click",
            () => {

                if (isTurning) {

                    return;

                }


                buildCube();

            }
        );


    /* =====================================================
       DRAG TO ROTATE WHOLE CUBE
    ===================================================== */

    let dragging = false;

    let previousX = 0;

    let previousY = 0;


    renderer.domElement.addEventListener(
        "pointerdown",
        event => {

            dragging = true;

            previousX =
                event.clientX;

            previousY =
                event.clientY;


            renderer.domElement.setPointerCapture(
                event.pointerId
            );

        }
    );


    renderer.domElement.addEventListener(
        "pointermove",
        event => {

            if (!dragging) {

                return;

            }


            const deltaX =
                event.clientX -
                previousX;


            const deltaY =
                event.clientY -
                previousY;


            previousX =
                event.clientX;


            previousY =
                event.clientY;


            /*
                Horizontal drag = Y rotation.
            */

            cubeGroup.rotation.y +=
                deltaX * 0.01;


            /*
                Vertical drag = X rotation.
            */

            cubeGroup.rotation.x +=
                deltaY * 0.01;


            /*
                Prevent the cube from
                flipping completely.
            */

            cubeGroup.rotation.x =
                Math.max(
                    -1.2,
                    Math.min(
                        1.2,
                        cubeGroup.rotation.x
                    )
                );

        }
    );


    renderer.domElement.addEventListener(
        "pointerup",
        event => {

            dragging = false;

            renderer.domElement.releasePointerCapture(
                event.pointerId
            );

        }
    );


    renderer.domElement.addEventListener(
        "pointerleave",
        () => {

            dragging = false;

        }
    );


    /* =====================================================
       RESIZE
    ===================================================== */

    function resize() {

        const width =
            container.clientWidth;


        const height =
            container.clientHeight;


        if (
            width === 0 ||
            height === 0
        ) {

            return;

        }


        camera.aspect =
            width / height;


        camera.updateProjectionMatrix();


        renderer.setSize(
            width,
            height
        );

    }


    window.addEventListener(
        "resize",
        resize
    );


    /* =====================================================
       RENDER LOOP
    ===================================================== */

    function animate() {

        requestAnimationFrame(
            animate
        );


        renderer.render(
            scene,
            camera
        );

    }


    animate();

}