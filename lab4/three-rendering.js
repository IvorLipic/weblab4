	// Initialize scene, camera, renderer, and light
	const scene = new THREE.Scene(); 
	const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000); 
	const renderer = new THREE.WebGLRenderer(); 
	const container = document.getElementById('3d-container');

	console.log(container.clientWidth)

	// Set the renderer size based on the container's dimensions
	renderer.setSize(container.clientWidth, container.clientHeight);
	container.appendChild(renderer.domElement);

	// Basic lighting
	const light = new THREE.DirectionalLight(0xffffff, 1);
	light.position.set(1, 1, 1).normalize();
	scene.add(light);

	// Ambient light
	const ambientLight = new THREE.AmbientLight(0x404040, 2);
	scene.add(ambientLight);

	// Load the .obj file using OBJLoader
	const loader = new THREE.OBJLoader();
	loader.load(
	    'dragon.obj', 
	    (object) => {
     		scene.add(object);
    	    }
	);

	// Set the camera's position further away to make sure it captures the object
	camera.position.z = 1;
	camera.position.x = 0;
	camera.position.y = 0;

	// Animation Loop to render the scene and animate the object
	let isAnimating = false;
	let i = 1;
	function animate() {
	  if (!isAnimating) return;
	    requestAnimationFrame(animate);

	    // Rotate the object
	    scene.traverse((child) => {
	      if (child instanceof THREE.Mesh) {
	        child.rotation.y += 0.0025;
	        child.rotation.x += 0.00025;
		if(child.rotation.x > 0.3 * i) {
		  i++;
		  isAnimating = false;
		  document.getElementById('toggleAnimation').textContent = 'Start Animation';
		  return;
		}

	    	// Change the color over time
            	const time = Date.now() * 0.001;

            	// Set a color that changes over time (RGB values that cycle)
            	child.material.color.setRGB(0.5, Math.sin(time * 0.5) * 0.5 + 0.1, Math.sin(time * 0.5) * 0.5 + 0.5);
	      }
	  });

	  // Render the scene from the camera's perspective
	  renderer.render(scene, camera);
	}

	// Button to toggle the animation
	document.getElementById('toggleAnimation').addEventListener('click', () => {
    	  isAnimating = !isAnimating; // Toggle the animation state
    	  if (isAnimating) {
            animate();
            document.getElementById('toggleAnimation').textContent = 'Stop Animation';
    	  } else {
            document.getElementById('toggleAnimation').textContent = 'Start Animation';
    	  }
	});

	// Handle window resizing
	window.addEventListener('resize', () => {
	    renderer.setSize(container.clientWidth, container.clientHeight);
	    camera.aspect = container.clientWidth / container.clientHeight;
	    camera.updateProjectionMatrix();
	});
