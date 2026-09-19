// Doodle & Degree - Procedural Sticker Doodle Avatars & Mascot

const AvatarSVGs = {
  cat: (size = 48) => `
    <svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="avatar-svg">
      <!-- Background sticker bubble -->
      <circle cx="50" cy="50" r="46" fill="#FFE600" stroke="#1E1E24" stroke-width="4"/>
      
      <!-- Cat Head -->
      <path d="M26 62 C22 46, 26 36, 34 38 C38 40, 42 45, 46 45 C50 45, 54 40, 58 38 C66 36, 70 46, 66 62 C64 74, 30 74, 26 62 Z" fill="#FCFBF7" stroke="#1E1E24" stroke-width="3.5" stroke-linejoin="round"/>
      
      <!-- Cat Ears Inner -->
      <path d="M29 44 L35 43 L32 49 Z" fill="#FF4B82"/>
      <path d="M63 44 L57 43 L60 49 Z" fill="#FF4B82"/>
      
      <!-- Eyes -->
      <ellipse cx="38" cy="54" rx="4.5" ry="5.5" fill="#1E1E24"/>
      <circle cx="36.5" cy="52.5" r="1.5" fill="#FFFFFF"/>
      <ellipse cx="54" cy="54" rx="4.5" ry="5.5" fill="#1E1E24"/>
      <circle cx="52.5" cy="52.5" r="1.5" fill="#FFFFFF"/>
      
      <!-- Cute Nose & Mouth -->
      <polygon points="46,58 44,56 48,56" fill="#FF4B82"/>
      <path d="M43 60 Q46 63 49 60" fill="none" stroke="#1E1E24" stroke-width="2.5" stroke-linecap="round"/>
      
      <!-- Whiskers -->
      <line x1="26" y1="56" x2="16" y2="54" stroke="#1E1E24" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="26" y1="60" x2="15" y2="62" stroke="#1E1E24" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="66" y1="56" x2="76" y2="54" stroke="#1E1E24" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="66" y1="60" x2="77" y2="62" stroke="#1E1E24" stroke-width="2.5" stroke-linecap="round"/>
      
      <!-- Oversized Graduation Cap (Mortarboard) -->
      <path d="M46 16 L78 27 L46 38 L14 27 Z" fill="#1E1E24" stroke="#1E1E24" stroke-width="2"/>
      <path d="M30 33 L30 40 Q46 47 62 40 L62 33" fill="#2563EB" stroke="#1E1E24" stroke-width="2.5"/>
      <!-- Cap Button & Gold Tassel -->
      <circle cx="46" cy="27" r="3" fill="#FFE600" stroke="#1E1E24" stroke-width="1.5"/>
      <path d="M46 27 Q68 28 68 42 L66 48" fill="none" stroke="#FFE600" stroke-width="3" stroke-linecap="round"/>
      <circle cx="66" cy="48" r="3.5" fill="#FFE600" stroke="#1E1E24" stroke-width="1.5"/>
      
      <!-- Graffiti Sparkle -->
      <path d="M80 18 L82 12 L84 18 L90 20 L84 22 L82 28 L80 22 L74 20 Z" fill="#FF4B82"/>
    </svg>
  `,

  bird: (size = 48) => `
    <svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="avatar-svg">
      <!-- Background sticker bubble -->
      <circle cx="50" cy="50" r="46" fill="#00E5A3" stroke="#1E1E24" stroke-width="4"/>
      
      <!-- Bird Body -->
      <ellipse cx="50" cy="58" rx="24" ry="22" fill="#2563EB" stroke="#1E1E24" stroke-width="3.5"/>
      <!-- Belly -->
      <ellipse cx="50" cy="63" rx="15" ry="13" fill="#FFE600" stroke="#1E1E24" stroke-width="2.5"/>
      
      <!-- Mischievous Sunglasses -->
      <rect x="30" y="47" width="16" height="11" rx="3" fill="#1E1E24" stroke="#FCFBF7" stroke-width="1.5"/>
      <rect x="52" y="47" width="16" height="11" rx="3" fill="#1E1E24" stroke="#FCFBF7" stroke-width="1.5"/>
      <line x1="46" y1="52" x2="52" y2="52" stroke="#1E1E24" stroke-width="3"/>
      
      <!-- Sharp Beak -->
      <polygon points="44,59 54,59 49,67" fill="#FF7849" stroke="#1E1E24" stroke-width="2.5"/>
      
      <!-- Graduation Cap -->
      <path d="M50 15 L78 25 L50 35 L22 25 Z" fill="#1E1E24" stroke="#1E1E24" stroke-width="2"/>
      <path d="M34 30 L34 38 Q50 43 66 38 L66 30" fill="#FF4B82" stroke="#1E1E24" stroke-width="2"/>
      <circle cx="50" cy="25" r="2.5" fill="#FFE600"/>
      <path d="M50 25 Q28 27 28 40" fill="none" stroke="#FFE600" stroke-width="2.5" stroke-linecap="round"/>
      <circle cx="28" cy="40" r="3" fill="#FFE600"/>
    </svg>
  `,

  flame: (size = 48) => `
    <svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="avatar-svg">
      <!-- Background sticker bubble -->
      <circle cx="50" cy="50" r="46" fill="#FF4B82" stroke="#1E1E24" stroke-width="4"/>
      
      <!-- Outer Flame -->
      <path d="M50 18 C32 30, 24 50, 26 66 C28 78, 40 84, 52 84 C68 84, 76 74, 74 60 C72 44, 58 38, 62 26 C58 24, 54 20, 50 18 Z" fill="#FF7849" stroke="#1E1E24" stroke-width="3.5"/>
      
      <!-- Inner Flame -->
      <path d="M50 38 C42 46, 38 58, 40 68 C42 75, 48 78, 54 78 C62 78, 66 72, 64 62 C62 52, 54 48, 50 38 Z" fill="#FFE600" stroke="#1E1E24" stroke-width="2"/>
      
      <!-- Happy Face -->
      <ellipse cx="44" cy="58" rx="3.5" ry="4.5" fill="#1E1E24"/>
      <circle cx="43" cy="56" r="1.2" fill="#FFFFFF"/>
      <ellipse cx="56" cy="58" rx="3.5" ry="4.5" fill="#1E1E24"/>
      <circle cx="55" cy="56" r="1.2" fill="#FFFFFF"/>
      <path d="M46 64 Q50 68 54 64" fill="none" stroke="#1E1E24" stroke-width="2.5" stroke-linecap="round"/>
      
      <!-- Graduation Cap on top -->
      <path d="M48 10 L72 19 L48 28 L24 19 Z" fill="#1E1E24" stroke="#1E1E24" stroke-width="2"/>
      <circle cx="48" cy="19" r="2.5" fill="#00E5A3"/>
      <path d="M48 19 Q66 22 66 32" fill="none" stroke="#00E5A3" stroke-width="2.5" stroke-linecap="round"/>
    </svg>
  `,

  dino: (size = 48) => `
    <svg width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="avatar-svg">
      <!-- Background sticker bubble -->
      <circle cx="50" cy="50" r="46" fill="#8B5CF6" stroke="#1E1E24" stroke-width="4"/>
      
      <!-- Dino Head & Body -->
      <path d="M30 46 C28 32, 44 26, 62 28 C74 30, 78 40, 74 52 C70 58, 62 58, 62 64 C62 76, 44 82, 34 74 C26 66, 32 54, 30 46 Z" fill="#00E5A3" stroke="#1E1E24" stroke-width="3.5"/>
      
      <!-- Dino Spikes -->
      <polygon points="26,38 18,40 25,46" fill="#FFE600" stroke="#1E1E24" stroke-width="2"/>
      <polygon points="23,48 15,52 23,58" fill="#FFE600" stroke="#1E1E24" stroke-width="2"/>
      <polygon points="25,60 17,66 26,70" fill="#FFE600" stroke="#1E1E24" stroke-width="2"/>
      
      <!-- Cute Big Eye -->
      <circle cx="56" cy="40" r="7" fill="#FFFFFF" stroke="#1E1E24" stroke-width="2.5"/>
      <circle cx="58" cy="40" r="4" fill="#1E1E24"/>
      <circle cx="56.5" cy="38.5" r="1.5" fill="#FFFFFF"/>
      
      <!-- Dino Teeth Grin -->
      <path d="M48 54 Q60 56 68 50" fill="none" stroke="#1E1E24" stroke-width="2.5"/>
      <polygon points="52,54 55,59 58,55" fill="#FFFFFF"/>
      <polygon points="60,54 63,58 66,52" fill="#FFFFFF"/>
      
      <!-- Little Pencil in Hand -->
      <rect x="66" y="62" width="18" height="6" rx="2" transform="rotate(-30 66 62)" fill="#FFE600" stroke="#1E1E24" stroke-width="2"/>
      <polygon points="81,51 86,49 83,54" fill="#FF4B82" stroke="#1E1E24" stroke-width="1.5"/>
      
      <!-- Graduation Cap -->
      <path d="M46 14 L74 23 L46 32 L18 23 Z" fill="#1E1E24" stroke="#1E1E24" stroke-width="2"/>
      <circle cx="46" cy="23" r="2.5" fill="#FF4B82"/>
      <path d="M46 23 Q25 25 25 36" fill="none" stroke="#FF4B82" stroke-width="2.5" stroke-linecap="round"/>
    </svg>
  `
};

function getAvatarSvg(type, size = 48) {
  const gen = AvatarSVGs[type] || AvatarSVGs.cat;
  return gen(size);
}
