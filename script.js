// script.js

// Scene, Camera, Renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Set the background color of the webpage
document.body.style.backgroundColor = "#FFDFD6";

// Background
const loader = new THREE.CubeTextureLoader();
loader.setPath('textures/');
const textureCube = loader.load([
    'px.png', 'nx.png',
    'py.png', 'ny.png',
    'pz.png', 'nz.png'
]);
scene.background = textureCube;

// Building Material
const buildingColor = 0xE2DAD6; // Light color for the building
const buildingMaterial = new THREE.MeshStandardMaterial({ color: buildingColor, roughness: 0.5 }); // Rough texture

// Create the base of the store
const baseGeometry = new THREE.BoxGeometry(3, 1.5, 2);
const base = new THREE.Mesh(baseGeometry, buildingMaterial);
base.position.y = 0.75; // Position the base

// Create the roof
const roofGeometry = new THREE.BoxGeometry(3.2, 0.1, 2.2);
const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 }); // Dark gray for the roof
const roof = new THREE.Mesh(roofGeometry, roofMaterial);
roof.position.y = 1.5; // Position the roof

// Create a parent object to hold the store components
const storeGroup = new THREE.Group();
storeGroup.add(base);
storeGroup.add(roof);
scene.add(storeGroup); // Add the store group to the scene

// Create windows
const windowGeometry = new THREE.PlaneGeometry(0.8, 0.5);
const windowMaterial = new THREE.MeshBasicMaterial({ color: 0x87CEEB, side: THREE.DoubleSide }); // Light blue color for windows

// Create windows on the front
for (let i = -1; i <= 1; i += 2) {
    const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
    windowMesh.position.set(i, 1, 1.01); // Position the window slightly in front of the building
    storeGroup.add(windowMesh); // Add windows to the store group
}

// Neon Sign
const neonGeometry = new THREE.PlaneGeometry(1.5, 0.3);
const neonMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff, emissive: 0xff00ff, side: THREE.DoubleSide }); // Pink neon color
const neonSign = new THREE.Mesh(neonGeometry, neonMaterial);
neonSign.position.set(0, 1.2, 1.01); // Position the neon sign
storeGroup.add(neonSign); // Add neon sign to the store group

// Create text for the neon sign
const textGeometry = new THREE.TextGeometry('WELCOME', {
    font: new THREE.FontLoader().load('fonts/helvetiker_regular.typeface.json'), // Load a font
    size: 0.2,
    height: 0.05,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.01,
    bevelSize: 0.01,
    bevelSegments: 5
});
const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
const textMesh = new THREE.Mesh(textGeometry, textMaterial);
textMesh.position.set(-0.7, 1.2, 1.02); // Position the text on the neon sign
storeGroup.add(textMesh); // Add text to the store group

// Create a circular road
const roadGeometry = new THREE.CircleGeometry(4, 64); // Create a circular road
const roadMaterial = new THREE.MeshBasicMaterial({ color: 0x404040 }); // Dark gray color for roads
const road = new THREE.Mesh(roadGeometry, roadMaterial);
road.rotation.x = -Math.PI / 2; // Rotate the road to lie flat
storeGroup.add(road); // Add road to the store group

// Car
const carGeometry = new THREE.BoxGeometry(0.5, 0.2, 0.3);
const carMaterial = new THREE.MeshBasicMaterial({ color: 0xF3FEB8 }); // Set car color
const car = new THREE.Mesh(carGeometry, carMaterial);
car.position.set(3, 0.1, 0); // Start position on the road
storeGroup.add(car); // Add car to the store group

// Motorbike
const bikeGeometry = new THREE.BoxGeometry(0.3, 0.2, 0.5);
const bikeMaterial = new THREE.MeshBasicMaterial({ color: 0xF5004F }); // Set bike color
const bike = new THREE.Mesh(bikeGeometry, bikeMaterial);
bike.position.set(2.5, 0.1, 0.5); // Start position on the road
storeGroup.add(bike); // Add bike to the store group

// Camera Position
camera.position.z = 6;

// Mouse Interaction
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

document.addEventListener('mousedown', (event) => {
    isDragging = true;
});

document.addEventListener('mouseup', (event) => {
    isDragging = false;
});

document.addEventListener('mousemove', (event) => {
    if (isDragging) {
        const deltaMove = {
            x: event.clientX - previousMousePosition.x,
            y: event.clientY - previousMousePosition.y,
        };

        const rotationSpeed = 0.005; // Slower rotation speed
        storeGroup.rotation.y += deltaMove.x * rotationSpeed; // Rotate around Y-axis
        storeGroup.rotation.x += deltaMove.y * rotationSpeed; // Rotate around X-axis
    }
    previousMousePosition = { x: event.clientX, y: event.clientY };
});

// Animation Loop
let carAngle = 0; // Angle for car movement
let bikeAngle = 0; // Angle for bike movement
const roadRadius = 4; // Radius of the circular road

function animate() {
    requestAnimationFrame(animate);

    // Flicker effect for the neon sign
    if (Math.random() < 0.1) { // 10% chance to flicker
        neonMaterial.opacity = Math.random() < 0.5 ? 1 : 0.5; // Flicker between full brightness and dim
    } else {
        neonMaterial.opacity = 1; // Ensure it's fully lit most of the time
    }

    // Move the car in a circular path
    carAngle += 0.01; // Car speed
    car.position.x = roadRadius * Math.cos(carAngle);
    car.position.z = roadRadius * Math.sin(carAngle);

    // Move the motorbike in a circular path (faster)
    bikeAngle += 0.015; // Motorbike speed
    bike.position.x = roadRadius * Math.cos(bikeAngle);
    bike.position.z = roadRadius * Math.sin(bikeAngle);

    renderer.render(scene, camera);
}

animate();