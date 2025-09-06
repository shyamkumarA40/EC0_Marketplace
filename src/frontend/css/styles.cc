/* Keyframe animations for the hero banner text */
@keyframes fadeInDown {
    0% {
        opacity: 0;
        transform: translateY(-20px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes fadeInUp {
    0% {
        opacity: 0;
        transform: translateY(20px);
    }
    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-fade-in-down {
    animation: fadeInDown 1s ease-out forwards;
}

.animate-fade-in-up {
    animation: fadeInUp 1s ease-out 0.5s forwards;
    opacity: 0; /* Start hidden */
}

/* Styling for the category cards */
.category-card {
    @apply bg-gray-100 p-6 rounded-lg text-center cursor-pointer transition-all duration-300;
}

.category-card:hover {
    @apply bg-green-100 shadow-lg transform -translate-y-2;
}
