export interface WikiArticle {
  id: string;
  title: string;
  category: 'Plumbing DIY' | 'Electrical DIY' | 'Carpentry & Doors' | 'Masonry & Walls' | 'Water Conservation' | 'Resilient Construction';
  difficulty: 'Beginner (10-15 mins)' | 'Easy (15-20 mins)' | 'Intermediate (30 mins)' | 'Community Scale';
  estimatedTime: string;
  tagline: string;
  summary: string;
  materials: string[];
  toolsNeeded: string[];
  bulletPoints: string[];
  deepDive: {
    origin: string;
    coreMechanism: string;
    stepByStep: string[];
    practicalTips: string[];
    whenToCallPro: string;
  };
}

export const WIKI_ARTICLES: WikiArticle[] = [
  // 1. Leaking Tap (User's primary explicit mention)
  {
    id: 'repair-leaking-tap',
    title: 'How to Fix a Dripping or Leaking Tap',
    category: 'Plumbing DIY',
    difficulty: 'Beginner (10-15 mins)',
    estimatedTime: '10-15 mins',
    tagline: 'Replace the worn rubber washer or spindle O-ring to stop water waste immediately',
    summary: 'A continuously dripping tap can waste over 20-40 liters of clean drinking water every day. In 90% of cases, the leak is caused by a hardened rubber washer or damaged spindle thread that anyone can replace with a basic wrench in just 10 minutes.',
    toolsNeeded: ['Adjustable wrench or spanner', 'Flathead screwdriver', 'Plumber PTFE Teflon tape', 'Clean rag / cloth'],
    materials: [
      'Standard rubber tap washer (1/2" or 3/4" size)',
      'Spindle O-ring (silicone or nitrile)',
      'PTFE Teflon sealing tape (₹15 at any hardware stall)',
      'Mild vinegar or lime descaler'
    ],
    bulletPoints: [
      'Main Inflow Cut-off: Always close the local angle stopcock under the basin or the main overhead water tank line before unscrewing anything.',
      'Decorative Cap Removal: Pry off the small red/blue or chrome logo cap on the tap handle using a thin flathead blade to expose the retaining screw.',
      'Spindle Hex Extraction: Turn the exposed brass spindle counter-clockwise using an adjustable wrench padded with a cloth to avoid scratching.',
      'Washer Replacement: Unscrew the bottom brass retaining nut on the spindle, pop out the compressed old rubber ring, and push in the fresh washer.',
      'Teflon Thread Sealing: Wrap 4-5 turns of Teflon tape clockwise along the brass threads before threading the spindle back into the faucet body.'
    ],
    deepDive: {
      origin: 'Standard bib-cock and compression-valve tap engineering used universally across residential plumbing across India and globally since the early 1900s.',
      coreMechanism: 'When the handle turns, the brass spindle drives a resilient rubber disc down against the smooth circular brass valve seat. Over years of hard ground water and friction, the rubber washer grooves and hardens, allowing pressurized water to seep continuously.',
      stepByStep: [
        'Turn off the water supply: Shut the angle valve under the washbasin or the terrace line gate valve. Open the tap fully to drain residual water pressure.',
        'Expose the handle screw: Use a flat screwdriver to gently pry out the small plastic top button or index cap (marked C or H).',
        'Remove the handle: Unscrew the center Phillips/flathead screw and wiggle the handle knob upward off the splined stem.',
        'Unscrew the tap valve spindle: Place your spanner on the large brass hexagonal nut. Turn counter-clockwise until the internal assembly slides out.',
        'Inspect and swap the washer: At the base of the spindle, inspect the rubber washer. If flattened or cracked, remove the small brass nut or push-pin, swap in a new rubber washer, and fasten firmly.',
        'Clean the internal brass seat: Wipe away any limescale grit from the inner tap hole using a vinegar-soaked cloth or old toothbrush.',
        'Reassemble with Teflon: Wrap 4-5 layers of Teflon tape onto the threads, screw the spindle back by hand, tighten with the spanner (do not over-torque), reinstall the handle, and reopen the water supply to test.'
      ],
      practicalTips: [
        'Place an old towel inside the sink bowl to plug the drain so small screws or washers cannot accidentally fall into the sewer pipe.',
        'If the leak continues even with a brand new washer, the brass "seat" inside may be pitted; rub it smooth with a coin wrapped in fine emery paper.',
        'Always wrap Teflon tape in the clockwise direction so it tightens into the thread rather than bunching up.'
      ],
      whenToCallPro: 'If the brass threads inside the wall fitting are stripped, or the spindle is completely corroded and breaks inside the pipe.'
    }
  },

  // 2. Unclogging Slow Basin Drain
  {
    id: 'unclog-sink-drain',
    title: 'Clearing a Blocked or Slow Basin Sink Drain',
    category: 'Plumbing DIY',
    difficulty: 'Beginner (10-15 mins)',
    estimatedTime: '10-15 mins',
    tagline: 'Clear hair, soap sludge, and grease using baking soda, hot water, and bottle-trap cleaning',
    summary: 'Hair, congealed soap, and tooth-paste build up inside the plastic P-trap or bottle trap underneath sinks, leading to foul odor and standing dirty water. Clear it permanently in 10 minutes without harsh corrosive acids that ruin PVC pipes.',
    toolsNeeded: ['Small bucket or plastic container', 'Old wire clothes hanger or zip-strip', 'Rubber gloves', 'Old cleaning brush'],
    materials: [
      '1/2 cup Baking soda (Sodium Bicarbonate)',
      '1 cup White household vinegar',
      '2 liters Boiled hot water',
      'Clean replacement bottle-trap rubber gasket (optional)'
    ],
    bulletPoints: [
      'Chemical-Free De-greasing: Pouring dry baking soda followed by warm vinegar generates natural effervescent carbon dioxide that dissolves soap scum and hair clumps.',
      'Bottle Trap Servicing: Placing a small bucket below the sink and twisting off the lower threaded cup catches 95% of trapped foreign objects.',
      'Wire Hook Snagging: Straightening an old wire coat hanger with a 5mm hook easily catches hair tangles lodged right beneath the chrome pop-up strainer.',
      'Hot Water Flush: Flushing with kettle-hot water after clearing melts residual greasy deposits clinging to the corrugated discharge pipe.'
    ],
    deepDive: {
      origin: 'Modern hygienic sanitary trap designs mandated in domestic plumbing to maintain a 50mm liquid water barrier against foul sewer gases.',
      coreMechanism: 'Gravity allows heavy particles and hair to settle at the lowest curve of the U-bend or bottle-trap bottom reservoir while letting clear water overflow into the municipal sewer line.',
      stepByStep: [
        'Clear surface standing water: Scoop out any stagnant water from the basin with a small mug into a bucket.',
        'Extract surface debris: Use a bent coat hanger or plastic drainage snake down the drain holes to twist and pull up hair mats.',
        'Position the catchment basin: Place a shallow bucket directly underneath the cylindrical trap located below your sink.',
        'Unscrew the lower trap base: With rubber gloves on, twist the bottom threaded cup counter-clockwise. Stagnant sludge and water will drop into your bucket.',
        'Clean the internal tube: Wash the removed cup under an external tap with an old brush. Inspect the thin rubber seal ring.',
        'Screw back the cup securely: Ensure the rubber gasket sits flat in its groove before tightening by hand to prevent leaks.',
        'Baking soda & vinegar flush: Pour 1/2 cup baking soda down the plug hole, immediately follow with 1 cup warm vinegar, wait 10 minutes, then flush with a kettle of hot water.'
      ],
      practicalTips: [
        'Never pour boiling water directly into thin plastic corrugated hoses; warm water (around 60-70°C) is ideal to avoid warping.',
        'Install a ₹30 stainless steel mesh strainer over your basin plug hole to catch 99% of hair strands before they ever enter the pipe.'
      ],
      whenToCallPro: 'If water backs up simultaneously in both your bathroom floor drain and shower, indicating a main soil-stack blockage.'
    }
  },

  // 3. Continuously Running Flush Cistern / Toilet
  {
    id: 'repair-running-flush-cistern',
    title: 'Fixing a Running Flush Tank or Toilet Cistern',
    category: 'Plumbing DIY',
    difficulty: 'Beginner (10-15 mins)',
    estimatedTime: '10-15 mins',
    tagline: 'Stop constant toilet hissing, overflow leakage, and high water bills in 10 minutes',
    summary: 'A continuously running toilet flush cistern can waste upwards of 200 liters of water every single day. The fault is almost always either a misaligned siphon flap, a tangled pull chain, or an unadjusted float ball valve.',
    toolsNeeded: ['Flathead screwdriver', 'Adjustable pliers', 'Cleaning cloth'],
    materials: [
      'Universal toilet flapper rubber seal or silicone diaphragm (₹40)',
      'Brass or stainless steel bead chain',
      'Plumber float valve adjustment washer'
    ],
    bulletPoints: [
      'Flapper Seal seating: 80% of running tanks occur because the rubber flapper or silicone siphon disc at the bottom fails to seat flat over the flush orifice.',
      'Float Arm Water Level: If the float ball rises too late, water continuously spills into the central overflow tube; bending the arm downward fixes it in 30 seconds.',
      'Chain Slack Optimization: If the lever chain is too tight, it prevents the flapper from closing; if too loose, it slips off the hook.',
      'Siphon Diaphragm Swapping: On modern push-button dual-flush tanks, twisting the central plastic cylinder 90 degrees unlocks the rubber washer for a quick rinse.'
    ],
    deepDive: {
      origin: 'Derived from Thomas Crapper’s 19th-century valveless siphonic flush box and float-valve buoyancy mechanisms.',
      coreMechanism: 'The cistern fills until a buoyant ball or float cup rises high enough to compress an inlet plunger. When triggered, the flapper opens to discharge water into the pan, then gravity seals it back over the opening before filling restarts.',
      stepByStep: [
        'Remove the tank lid: Carefully lift off the ceramic or plastic cistern lid and place it safely on a floor rug.',
        'Inspect the water level: Check if water is trickling over the top rim of the central plastic vertical overflow pipe.',
        'Adjust the float level: If overflowing, turn the plastic screw on top of the float valve clockwise (or gently bend a brass rod downward) so the water shuts off 2.5cm (1 inch) below the overflow rim.',
        'Check the flapper flap: Turn off the cistern angle stopcock. Flush the tank. Feel the underside of the rubber flapper or siphon disc. If covered in slimy mineral grime, wipe it thoroughly.',
        'Swap the flapper if warped: If the rubber is brittle or warped, unhook it from the plastic side ears, slip on a new silicone seal, and reconnect the chain with 1-2 links of slack.',
        'Turn on water and test: Watch the cistern fill and verify that the water stops cleanly and the pan remains completely dry without trickles.'
      ],
      practicalTips: [
        'Drop 4 drops of blue food coloring into the cistern tank. Without flushing, wait 15 minutes. If blue color appears in the toilet pan, your bottom seal is leaking.',
        'Never use drop-in chemical bleach tablets inside the cistern; they accelerate rubber degradation.'
      ],
      whenToCallPro: 'If the porcelain cistern is cracked, or the angle valve below the tank has seized and cannot be shut off.'
    }
  },

  // 4. Low Water Pressure - Showerhead & Tap Aerator Cleaning
  {
    id: 'clean-tap-aerator-showerhead',
    title: 'Restoring Water Pressure: Cleaning Tap Aerators & Showerheads',
    category: 'Plumbing DIY',
    difficulty: 'Beginner (10-15 mins)',
    estimatedTime: '10 mins',
    tagline: 'Dissolve stubborn hard-water limescale to restore a full, high-pressure spray',
    summary: 'Hard ground water and borewell salts leave chalky calcium carbonate crusts inside tap aerator mesh and showerhead micro-nozzles, cutting water flow to a frustrating trickle. Dissolve it completely in minutes using cheap kitchen items.',
    toolsNeeded: ['Small plastic sandwich bag or bowl', 'Rubber band or string', 'Old toothbrush or safety pin', 'Adjustable wrench or pliers padded with tape'],
    materials: [
      '1 cup Household white vinegar or citric acid solution (₹25)',
      '1 tablespoon Baking soda',
      'PTFE Teflon tape'
    ],
    bulletPoints: [
      'Zero-Disassembly Plastic Bag Trick: Tie a plastic bag filled with warm vinegar directly around the mounted showerhead for 30 minutes to dissolve calcification without taking it off the wall.',
      'Tap Aerator Mesh Extraction: Unscrew the very tip of your kitchen or basin tap counter-clockwise using fingers or a tape-cushioned spanner.',
      'Nozzle Pin De-crusting: Poking small rubber nozzles on shower plates dislodges stubborn mineral pebbles instantly.',
      '100% Flow Restoration: Cleans micro-particles, fine sand, and mineral scale to bring back 100% factory flow.'
    ],
    deepDive: {
      origin: 'Modern water-saving aerators introduced in the 1970s introduce air bubbles into streams to produce high-velocity rinsing with 40% less water.',
      coreMechanism: 'Calcium carbonate (CaCO3) deposits are basic salts that chemically react with acetic acid (CH3COOH) in vinegar, releasing carbon dioxide gas and dissolving into soluble calcium acetate.',
      stepByStep: [
        'Examine the faucet spout: Look at the small metal collar at the tip of your water tap where water exits.',
        'Unscrew the aerator: Grip the ribbed aerator ring with dry fingers or pliers wrapped in masking tape. Twist counter-clockwise to unscrew.',
        'Disassemble the inner parts: Tap the aerator onto a clean plate. Note the order: rubber washer, fine mesh screen, plastic jet nozzle, and housing.',
        'Rinse away grit: Rinse the loose sand grains under another tap. Soak all small pieces in a cup of warm white vinegar for 10-15 minutes.',
        'Brush and reassemble: Scrub the wire mesh with an old toothbrush. Stack the pieces back in order, place the rubber washer flat on top, and hand-tighten onto the spout.'
      ],
      practicalTips: [
        'Perform this cleaning every 3-4 months if your building uses borewell or tanker water with high TDS.',
        'Never use metal wire brushes on chrome-plated finishes as they will permanently scratch the coating.'
      ],
      whenToCallPro: 'If the aerator is clean but water pressure remains low across all taps in the entire house (indicates tank air-lock or blocked main line).'
    }
  },

  // 5. Fixing Loose Screws in Hollow or Stripped Wooden Doors / Hinges
  {
    id: 'fix-stripped-hinge-screw',
    title: 'Fixing Loose Door Hinges & Stripped Screw Holes',
    category: 'Carpentry & Doors',
    difficulty: 'Beginner (10-15 mins)',
    estimatedTime: '10-15 mins',
    tagline: 'Repair sagging doors and spinning hinge screws permanently using wood toothpicks and glue',
    summary: 'When wooden door hinges sag or scrape the floor, it is almost always caused by a screw that spins endlessly because the wood grain inside the screw hole has stripped out. Fix it solidly in 10 minutes without buying new hinges.',
    toolsNeeded: ['Phillips screwdriver', 'Hammer or mallet', 'Utility knife or wire cutters', 'Wooden block or door wedge'],
    materials: [
      'Wooden toothpicks or bamboo skewers (₹10)',
      'PVA Wood glue (Fevicol or carpenter wood adhesive)',
      '1 longer wood screw (1.5" or 2" length) if deeper timber is present'
    ],
    bulletPoints: [
      'Sag Prevention: Wedge a cardboard piece or door stop under the door bottom before touching hinge screws to prevent sudden door twisting.',
      'Wood Fiber Packing Method: Filling the stripped void with glue-coated bamboo toothpicks provides fresh dense cellulose for the screw threads to grip.',
      'Bamboo vs Plastic Anchors: Hardwood bamboo toothpicks compress under the screw threads, creating a grip stronger than original pine plywood.',
      'Flush Trimming: Snapping the toothpicks flush with the hinge recess ensures the steel hinge plate sits flat against the timber jamb.'
    ],
    deepDive: {
      origin: 'Traditional joinery method used by European and Asian carpenters for centuries to re-peg loose dowels and hardware mortises without replacing timber frames.',
      coreMechanism: 'Wood screws rely on radial friction against intact wood fibers. Once the wood strips into sawdust, adding dense bamboo splinters coated in adhesive creates an ultra-tight composite plug that expands radially as the screw is driven in.',
      stepByStep: [
        'Prop the door: Insert a wedge under the bottom edge of the open door so its weight does not pull on the remaining hinges.',
        'Remove the spinning screw: Back out the loose hinge screw using a screwdriver.',
        'Prep the toothpick bundle: Take 3 to 5 wooden toothpicks or bamboo skewer pieces. Dip their ends into PVA wood glue.',
        'Pack the hole: Push the glued toothpicks as deeply into the stripped screw hole as they will go until the hole is completely packed tight.',
        'Trim flush: Use a utility knife or wire cutter to snip the toothpicks flush with the surface of the hinge cutout.',
        'Drive the screw: Immediately re-insert the hinge screw into the packed center and drive it straight in with your screwdriver. The screw will bite firmly and cinch tight.'
      ],
      practicalTips: [
        'For extra strength on heavy solid wood exterior doors, swap the middle 1-inch screw for a 2.5-inch wood screw that reaches the structural wall stud.',
        'Allow the wood glue 1 hour to cure before swinging the door vigorously.'
      ],
      whenToCallPro: 'If the entire wooden door frame is rotten from termites or extensive water damage from a nearby bathroom.'
    }
  },

  // 6. Fixing Squeaking & Sticking Door Latches
  {
    id: 'silence-squeaky-hinges-sticky-latch',
    title: 'Silencing Squeaky Hinges & Aligning Sticky Door Latches',
    category: 'Carpentry & Doors',
    difficulty: 'Beginner (10-15 mins)',
    estimatedTime: '10 mins',
    tagline: 'Stop loud hinge creaks and fix door bolts that will not slide into the strike plate',
    summary: 'A squeaking door is caused by dry metal-on-metal friction between the hinge pin and knuckles, while a sticking latch happens when seasonal humidity or slight settling misaligns the latch bolt with the brass strike hole. Fix both in minutes.',
    toolsNeeded: ['Small nail and hammer (to tap hinge pin)', 'Metal hand file or screwdriver', 'Clean rag'],
    materials: [
      'Machine oil, silicone lubricant, or sewing machine oil (or petroleum jelly)',
      'Dry graphite powder or soft 2B pencil lead',
      'Candle wax or bar of dry soap (for sticky wooden edges)'
    ],
    bulletPoints: [
      'Hinge Pin Lubrication: Lifting the central pin halfway up and coating it in mineral oil eliminates 100% of groaning metallic squeaks.',
      'Graphite for Cylinder Locks: Never use cooking oil inside lock keyways; powdered pencil graphite lubricates tumbler pins without attracting gummy dust.',
      'Strike Plate Alignment: Using lipstick or a marker on the door latch reveals exactly where the latch is rubbing against the metal strike plate.',
      'Soap Waxing Rub: Rubbing paraffin candle wax along the rubbing top or side edge of a swollen monsoon door creates an instant friction-free slide.'
    ],
    deepDive: {
      origin: 'Standard mechanical maintenance routines for architectural ironmongery and mortise locking mechanisms.',
      coreMechanism: 'Thin protective boundary lubrication prevents galling between steel hinge collars. Dry graphite provides solid-state platelet lubrication that does not attract environmental dust.',
      stepByStep: [
        'Identify the noisy hinge: Swing the door slowly back and forth while listening closely to locate the squeaking hinge (top, middle, or bottom).',
        'Extract the pin slightly: Place an old nail or punch under the bottom of the hinge pin and tap upward lightly with a hammer until the pin pops up 2-3 cm.',
        'Apply lubricant: Coat the exposed pin cylinder with 3 drops of light machine oil or a dab of petroleum jelly. Do not use cooking oil as it goes rancid and sticky.',
        'Tap the pin down: Push or tap the pin back down flush into the knuckle, then swing the door 10 times to distribute the oil along the bearing surfaces.',
        'Fix sticky strike plate: If the door latch does not catch, rub chalk or lipstick on the latch bolt. Close the door to see where the mark hits the metal plate on the frame.',
        'File or adjust: Use a small metal hand file to enlarge the strike plate opening by 1-2 mm where the mark showed, or tighten the top hinge screws to raise the door.'
      ],
      practicalTips: [
        'Always wipe away excess oil dripping from the bottom of the hinge immediately with a rag so it does not stain the paint or wall.',
        'For sticking wooden cupboard doors during monsoon humidity, rub a dry bar of bathing soap directly along the contacting edge.'
      ],
      whenToCallPro: 'If the door has dropped so severely that the top corner strikes the frame and requires planing down with a carpenter jack plane.'
    }
  },

  // 7. Replacing a Faulty Wall Light Switch or Plug Socket
  {
    id: 'replace-wall-switch-socket',
    title: 'Safely Replacing a Broken Light Switch or Loose Wall Socket',
    category: 'Electrical DIY',
    difficulty: 'Intermediate (30 mins)',
    estimatedTime: '15-20 mins',
    tagline: 'Fix sparking switches, loose plug prongs, and cracked modular switch plates safely',
    summary: 'A switch that sparks or feels loose can cause electrical short-circuits. Modular switches and 6A/16A sockets can be swapped in 15 minutes by strictly cutting the main MCB power first and following the standard three-wire color code.',
    toolsNeeded: ['Neon electrical tester pen', 'Insulated Phillips & flathead screwdrivers', 'Wire stripper or cutting pliers'],
    materials: [
      'Matching modular replacement switch (6A or 16A) or socket (Anchor, Havells, or Roma type)',
      'PVC electrical insulation tape',
      'Safety rubber footwear'
    ],
    bulletPoints: [
      'Mandatory Main MCB Shut-off: Always trip the room or main distribution board Miniature Circuit Breaker (MCB) and test with a neon pen before touching any wire.',
      'Neon Tester Verification: Touch the tester tip to all exposed brass screw terminals; the internal neon lamp MUST NOT glow.',
      'One-Wire-at-a-Time Rule: Transfer the live and load wires one by one directly from the old switch to the new one to prevent wiring confusion.',
      'Terminal Tightening: Loose screw terminals cause electrical arcing and heat; cinch down the terminal screws firmly onto clean copper strands.'
    ],
    deepDive: {
      origin: 'Modern modular electrical accessories governed by IS 3854 and IS 1293 safety codes across Indian residential wiring.',
      coreMechanism: 'A single-pole switch simply breaks or connects the Live (Phase) line running to the lighting fixture. When the mechanical copper leaf springs inside fatigue from repeated use, arcing occurs, requiring switch replacement.',
      stepByStep: [
        'Safety First: Switch OFF the specific room MCB or the entire home main circuit breaker. Stand on a dry rubber mat or wear rubber-soled slippers.',
        'Pry open the faceplate: Insert a flathead screwdriver into the bottom notch of the decorative modular plate and gently pop off the outer cover.',
        'Unscrew the internal frame: Remove the two long mounting screws holding the metal/plastic modular grid to the wall concealment box.',
        'Confirm zero voltage: Place the neon tester against both switch screw terminals while holding your finger on the tester cap. Confirm the lamp is 100% off.',
        'Expose the switch: Unclip the damaged switch module from the rear grid frame by squeezing the top and bottom retention tabs.',
        'Transfer the wires: Loosen the top terminal on the old switch and insert the wire into the corresponding terminal of the new switch; tighten the screw. Repeat for the bottom terminal.',
        'Remount and test: Tuck wires neatly into the back box without pinching. Fasten the two grid screws, snap the outer faceplate back on, turn the MCB ON, and test the new switch.'
      ],
      practicalTips: [
        'Take a clear smartphone photo of the wiring connections before unscrewing anything for instant reference.',
        'Never twist copper strands so tightly that you fracture the wire; strip 8-10mm of fresh copper if the old wire end is blackened or brittle.'
      ],
      whenToCallPro: 'If you smell burnt plastic inside the wall, notice black melted insulation deep in the conduit, or have an older home without a grounding wire.'
    }
  },

  // 8. Re-wiring a 3-Pin Power Plug
  {
    id: 'wire-three-pin-plug',
    title: 'How to Correctly Wire a 3-Pin Heavy Appliance Plug (6A / 16A)',
    category: 'Electrical DIY',
    difficulty: 'Beginner (10-15 mins)',
    estimatedTime: '10-15 mins',
    tagline: 'Master standard color codes (Live, Neutral, Earth) to wire geysers, irons, or coolers safely',
    summary: 'A cracked plug top or loose internal cord clamp causes sparks, electric shocks, and overheating cords. Rewiring a durable polycarbonate 3-pin plug takes less than 15 minutes and ensures maximum household electrical safety.',
    toolsNeeded: ['Small flathead or cross screwdriver', 'Wire stripper or sharp utility blade', 'Pliers'],
    materials: [
      'New 3-pin molded plug top (6 Amp for light appliances, 16 Amp for geyser/heater/AC)',
      'Heat-shrink tube or PVC electrical tape'
    ],
    bulletPoints: [
      'Standard Indian Color Code: Brown or Red = Live (L), Blue or Black = Neutral (N), Green or Green-Yellow = Earth (E, large top pin).',
      'The Safety Earth Pin: The top pin is intentionally thicker and longer so it connects to ground first and disconnects last during plug insertion.',
      'Internal Cord Grip: Always secure the outer thick cable jacket under the internal plastic clamp bar so pulling the cord never strains the small terminal screws.',
      'No Stray Strands: Ensure every individual copper hair is tucked inside the brass pillar before tightening the screw to prevent short circuits.'
    ],
    deepDive: {
      origin: 'BS 546 / IS 1293 round-pin standard used throughout India, the UK, and South Asia for reliable 230V residential power supply.',
      coreMechanism: 'The Earth pin routes stray chassis currents safely into the ground rod, triggering the RCCB/ELCB before the current can pass through human skin.',
      stepByStep: [
        'Disassemble new plug: Remove the central screw holding the plug cover and separate the top housing from the pin base.',
        'Strip the cable sheath: Strip back 35mm (1.5 inches) of the outer thick cable sleeve, taking care not to nick the inner colored wires.',
        'Prepare wire ends: Strip 8mm of insulation from each colored wire (Earth, Live, Neutral) and tightly twist the copper strands clockwise.',
        'Connect Earth (Green/Yellow): Insert the green wire into the large top center pin marked "E" and tighten the brass screw firmly.',
        'Connect Live (Red/Brown): Facing the plug pins, insert the live wire into the pin marked "L" (typically on the right-hand side). Tighten down.',
        'Connect Neutral (Black/Blue): Insert the neutral wire into the pin marked "N" (on the left-hand side). Tighten down.',
        'Fasten the cable clamp: Position the outer thick jacket directly beneath the plastic saddle bracket and screw both bracket screws down tightly.',
        'Close the plug: Align the top cover and tighten the central body screw.'
      ],
      practicalTips: [
        'Make the Earth wire slightly longer than the Live and Neutral wires inside the plug; if the cable is ever yanked violently, the Earth wire disconnects last.',
        'Never bypass a 3-pin plug with a 2-pin adapter on metal-bodied appliances like irons, refrigerators, washing machines, or water geysers.'
      ],
      whenToCallPro: 'If the wall socket into which you plug the appliance is visibly melted, cracked, or blackened from previous short circuits.'
    }
  },

  // 9. Patching Small Wall Cracks, Plaster Flakes & Nail Holes
  {
    id: 'patch-wall-cracks-nail-holes',
    title: 'Patching Fine Wall Cracks, Peeling Plaster & Old Nail Holes',
    category: 'Masonry & Walls',
    difficulty: 'Beginner (10-15 mins)',
    estimatedTime: '15 mins',
    tagline: 'Fill unsightly shrinkage cracks and holes smoothly before painting without dust or mess',
    summary: 'Hairline cracks and chipped plaster around old calendar nails make walls look untidy and allow dampness to penetrate. Repairing them flush with water-resistant acrylic wall putty or white cement takes just 15 minutes of work.',
    toolsNeeded: ['2-inch steel putty blade or flexible scraper', 'Coarse (80 grit) and fine (180 grit) sandpaper', 'Old brush to dust away grit'],
    materials: [
      'Ready-to-use Acrylic Wall Putty or White Portland Cement (₹30 pouch)',
      'Water spray bottle or damp sponge',
      'Touch-up wall paint matching your wall shade'
    ],
    bulletPoints: [
      'V-Groove Opening: Use the corner of your putty blade to lightly scrape open the hairline crack into a shallow V-notch so the putty bonds deep inside.',
      'Surface Moistening: Sprinkling or dabbing water along the crack prevents dry masonry from instantly sucking moisture out of the fresh patch.',
      'Cross-Angle Application: Hold the putty blade at a 45-degree angle, forcing the compound deeply into the hole, followed by a flat scraping pass.',
      'Zero-Shrink Layering: For deeper nail holes, fill in two thin passes rather than one thick dollop to avoid sunken crater depressions as it dries.'
    ],
    deepDive: {
      origin: 'Standard surface preparation practice in plastering and masonry finishing across traditional and modern architecture.',
      coreMechanism: 'Polymer-modified white cement putty possesses microscopic filler particles and elastic redispersible resins that grip porous brick plaster and resist thermal expansion cracks.',
      stepByStep: [
        'Prep the crack: Use the tip of an old screwdriver or scraper to remove loose flakes and scrape away peeling paint along the crack line.',
        'Dust off: Brush out dust using an old dry paintbrush or vacuum nozzle.',
        'Moisten the surface: Dab a wet sponge or spray a light mist of water along the crack to prevent rapid dry-out.',
        'Apply the putty: Scoop a marble-sized dab of ready-mixed wall putty onto your putty knife. Press firmly into the void with the knife held at 45 degrees.',
        'Smooth flush: In one smooth vertical motion with the blade tilted almost flat against the wall, scrape away all excess putty level with the paint.',
        'Sand smooth: Allow 30-45 minutes to dry. Rub lightly with 180-grit sandpaper until you cannot feel the seam with your fingertips. Wipe dust and apply touch-up paint.'
      ],
      practicalTips: [
        'For holes deeper than 10mm (like removed rawlplugs), push a small crumpled piece of paper or cotton plug into the bottom before applying putty.',
        'Do not use straight plaster of Paris (POP) in bathrooms or exterior walls; use polymer exterior acrylic crack filler.'
      ],
      whenToCallPro: 'If the crack is wider than 5mm, runs diagonally across structural concrete beams/columns, or you can see daylight through the wall.'
    }
  },

  // 10. Re-grouting Loose or Missing Bathroom & Kitchen Tile Joints
  {
    id: 're-grout-bathroom-tile-joints',
    title: 'Fixing Gaps in Bathroom & Kitchen Tile Grout',
    category: 'Masonry & Walls',
    difficulty: 'Beginner (10-15 mins)',
    estimatedTime: '15 mins',
    tagline: 'Seal porous tile gaps to permanently prevent water seepage and black mold behind tiles',
    summary: 'When tile grout washes away around the bathroom floor drain or tap outlets, shower water leaks down into the concrete slab, creating damp patches on the ceiling below. Re-filling tile seams with waterproof white cement grout takes 15 minutes.',
    toolsNeeded: ['Old butter knife or grout rake', 'Rubber squeegee or soft plastic scraper', 'Dense sponge or damp microfiber rag'],
    materials: [
      'Epoxy tile grout or Waterproof polymer-modified white cement (₹40 per 500g pouch)',
      'Waterproofing liquid additive (Dr. Fixit or similar, optional 2 capfuls)'
    ],
    bulletPoints: [
      'Seepage Prevention: 70% of ceiling dampness in apartments originates from degraded grout lines around bathroom shower bases and toilet pans.',
      'Clean Joint Preparation: Scraping out at least 2-3mm of old decayed crumbly grout creates a solid trench for the new cement to grip.',
      'Diagonal Squeegee Technique: Spreading wet grout diagonally across tiles forces the compound deep into lines without scooping it back out.',
      'Damp Sponge Polishing: Wiping with a slightly damp sponge 15 minutes after application cleans tiles while leaving smooth, slightly concave grout lines.'
    ],
    deepDive: {
      origin: 'Ceramic and vitrified tiling practice developed to accommodate minor thermal expansion while maintaining an impermeable hydraulic seal.',
      coreMechanism: 'Capillary water flow occurs when gaps larger than 0.1mm exist between glazed tiles. Dense polymer cement seals micro-channels, blocking gravity water percolation.',
      stepByStep: [
        'Rake the joint: Use an old flathead screwdriver or grout saw to scrape out loose, discolored grout between the tiles to a depth of 2-3 mm.',
        'Clean & dry: Scrub the joint with an old brush and wipe dry. Ensure no standing water remains in the tile seam.',
        'Mix the grout: In a small plastic cup, mix white cement tile grout with water (plus 2 drops of waterproofing liquid) until it reaches thick toothpaste consistency.',
        'Pack the joints: Using a rubber spatula or gloved finger, press the paste firmly into the tile seams, packing it solidly.',
        'Scrape excess: Sweep the rubber edge diagonally across the tile face at a 60-degree angle to leave the tile face clean.',
        'Sponge cleanup: Wait 15 minutes for the grout to turn firm. Wipe gently in circular motions with a wrung-out damp sponge to smooth the joint and remove the hazy film.'
      ],
      practicalTips: [
        'Do not use the shower or wet the newly grouted floor for at least 18-24 hours to allow full hydraulic curing.',
        'For joints where tiles meet the wall or sanitaryware, use flexible 100% silicone sealant rather than rigid cement grout to prevent cracking.'
      ],
      whenToCallPro: 'If tapping the tiles produces a hollow sound or several tiles are visibly rocking and detached from the underlying mortar bed.'
    }
  },

  // 11. Unclogging a Jammed Ceiling Fan or Oiling Bearings
  {
    id: 'ceiling-fan-maintenance',
    title: 'Ceiling Fan Care: Eliminating Wobble, Humming & Squeaks',
    category: 'Electrical DIY',
    difficulty: 'Easy (15-20 mins)',
    estimatedTime: '15-20 mins',
    tagline: 'Clean blade drag, tighten loose downrod bolts, and balance blades in 15 minutes',
    summary: 'Ceiling fans that hum loudly, spin sluggishly, or wobble dangerously usually suffer from heavy dust cake on blade leading edges, loose canopy screws, or dry ball-bearings. Restore quiet, fast airflow with simple DIY steps.',
    toolsNeeded: ['Sturdy ladder or solid stool', 'Phillips screwdriver', 'Cleaning pillowcase or damp cloth', 'Tape measure'],
    materials: [
      'Light machine lubricating oil or bearing spray',
      'Mild detergent soapy water',
      'Coin or plastic clothes peg (for blade balancing)'
    ],
    bulletPoints: [
      'Pillowcase Dusting Hack: Slip an old pillowcase over each blade and pull it back to trap 100% of greasy dust inside without dirt falling on beds or furniture.',
      'Airfoil Weight Balance: Uneven dust cakes of just 15 grams on one blade cause violent rotational wobble and motor strain.',
      'Downrod Cotter-Pin Check: Ensuring the safety cotter pin (split pin) is securely locked through the shackle bolt prevents catastrophic fan drops.',
      'Blade Pitch Alignment: Measuring the distance from the ceiling to each blade tip ensures all three blades sit at an identical level angle.'
    ],
    deepDive: {
      origin: 'Single-phase AC induction motor fans engineered for tropical continuous cooling operations across India since the 1920s.',
      coreMechanism: 'Aerodynamic lift and downward thrust depend on symmetrical 12-to-15 degree blade pitch. Centrifugal drag increases exponentially when leading edges accumulate dust fur, straining the starting capacitor.',
      stepByStep: [
        'Cut power: Turn off both the fan switch on the wall board and the room regulator.',
        'Trapped dust cleaning: Climb safely on a stable stool. Slide a pillowcase over a blade, press both hands against the cloth, and pull towards the tip. Wipe with a damp soapy rag.',
        'Check downrod hardware: Inspect the top and bottom shackle bolts. Ensure nuts are snug and the safety split pin is securely bent open.',
        'Tighten blade screws: Check the two screws securing each blade to the motor housing disc. Snug them down evenly with a screwdriver.',
        'Check height alignment: Hold a tape measure from the ceiling down to the tip of one blade. Rotate by hand and check the other blades. If one is sagging, gently bend the blade iron bracket upward to match.',
        'Lubricate bearing cup: Apply 2 drops of light oil into the upper bearing oil hole located near the motor spindle shaft. Turn by hand, step down, and switch ON.'
      ],
      practicalTips: [
        'Never pull down forcefully on the blade edges while cleaning as thin aluminum blades easily warp out of aerodynamic pitch.',
        'If the fan hums loudly and requires a manual push to start spinning, the starting capacitor (2.25µF or 2.5µF) needs a quick swap (₹30 part).'
      ],
      whenToCallPro: 'If the fan motor produces an acrid burning electrical smell or sparks from inside the motor coil casing.'
    }
  },

  // 12. De-clogging a Health Faucet / Jet Spray
  {
    id: 'fix-leaking-health-faucet-spray',
    title: 'Repairing a Leaking or Low-Flow Toilet Jet Spray / Health Faucet',
    category: 'Plumbing DIY',
    difficulty: 'Beginner (10-15 mins)',
    estimatedTime: '10 mins',
    tagline: 'Stop trigger handle drips and clear clogged micro-nozzles in minutes',
    summary: 'Bathroom health faucets frequently drip from the trigger lever or spray irregularly in crooked directions due to limescale crystals and worn internal rubber washers. Fix it in 10 minutes with zero plumbing experience.',
    toolsNeeded: ['Small spanner or adjustable pliers', 'Safety pin', 'Rag', 'Bowl'],
    materials: [
      '1/2 inch rubber hose washer with wire mesh filter (₹10)',
      'PTFE Teflon tape',
      'White vinegar for descaling'
    ],
    bulletPoints: [
      'Gasket Seating: Water leaking between the chrome spray head and flexible metallic hose is caused by a missing or squashed rubber O-ring gasket.',
      'Mesh Filter Rinse: Many modern spray heads contain a tiny concave stainless filter disc right inside the threaded coupling that collects pipe rust.',
      'Pin De-calcification: Poking clogged spray holes with a thin safety pin clears calcified borewell salts immediately.',
      'Trigger Spring Servicing: Unscrewing the faceplate allows you to rinse sand grains that jam the trigger shut-off return spring.'
    ],
    deepDive: {
      origin: 'Modern hygienic bidet spray wand introduced across Asian bathrooms as a water-efficient, non-contact sanitary solution.',
      coreMechanism: 'Water pressure is held by an internal spring-loaded rubber piston. Squeezing the trigger retracts the seal, releasing water through perforated nozzle orifices.',
      stepByStep: [
        'Shut the angle valve: Turn the small wall stopcock clockwise until water ceases flowing to the jet spray.',
        'Unscrew spray head: Turn the knurled metal cone at the end of the flexible hose counter-clockwise to detach the spray gun.',
        'Inspect the washer: Look inside the hose collar. If the black rubber washer is crushed or torn, pull it out and drop in a fresh 1/2" rubber washer.',
        'Descale the spray face: Unscrew the perforated front chrome faceplate (or soak the entire gun in a cup of warm vinegar for 15 minutes).',
        'Clean nozzles: Poke through any blocked tiny holes with a clean safety pin to clear mineral grit.',
        'Reassemble with Teflon: Wrap 2 turns of Teflon tape on the gun threads, insert the rubber gasket, hand-tighten firmly onto the hose, open the angle valve, and test the trigger.'
      ],
      practicalTips: [
        'Do not over-tighten the spray head connection with a giant wrench; hand-tightening with a 1/4-turn wrench cinch is sufficient to avoid slicing the rubber gasket.',
        'Always turn down the angle valve slightly if your home has excessive water booster pressure, preventing hose ruptures.'
      ],
      whenToCallPro: 'If the flexible steel braided hose is split open or leaking along its corrugated length (replace the hose entirely for ₹120).'
    }
  },

  // 13. Deep Traditional: Rainwater Harvesting
  {
    id: 'rainwater-harvesting',
    title: 'Traditional Rainwater Harvesting & Percolation Pits',
    category: 'Water Conservation',
    difficulty: 'Community Scale',
    estimatedTime: 'Weekend Project',
    tagline: 'Zero-power percolation pits & roof-catchment gravel filtration',
    summary: 'Centuries-old Indian water preservation systems—like Rajasthani Kunds and Deccan recharge pits—re-engineered for modern residential rooftops to harvest clean ground water without pumps.',
    toolsNeeded: ['Trowel', 'Spirit level', 'Pipe cutters', 'Shovel'],
    materials: [
      'Coarse river sand (0.5mm – 2mm)',
      'Graded blue basalt gravel (10mm – 20mm)',
      'Activated charcoal or crushed bio-char layer',
      'Perforated PVC filter casing (100mm)',
      'Local geotextile mesh or wire screen'
    ],
    bulletPoints: [
      'First-Flush Mechanism: Automatic separation of initial 15-20 minutes of monsoon rain carrying rooftop dust and leaf debris.',
      'Three-Stage Gravity Sand Filter: Layered chamber of coarse sand (top 40cm), fine charcoal (15cm), and crushed stone aggregate (30cm) for physical turbidity removal.',
      'Recharge Pit Dimensions: Typically 1.5m diameter by 2.5m depth with slotted unplasticized casing directing filtered water directly to shallow aquifers.',
      'Zero Operational Power: Entire collection, filtration, and subterranean recharge operates completely on natural gravity flow.',
      'Annual Maintenance Cycle: Simple pre-monsoon gravel wash and solar drying of charcoal layer preserves pit efficiency for decades.'
    ],
    deepDive: {
      origin: 'Rooted in the stepwell (Baoli) and Tanka traditions of dryland India, adapted to Deccan basalt plateau geology where high runoff can recharge open dug wells and borewells.',
      coreMechanism: 'Rooftop water is caught via sloping PVC gutters into a down-pipe equipped with a counterweight or manual T-valve first-flush diverter. Once clear water flows, it enters a decentralized gravity filtration pit before feeding the borewell casing or storage cistern.',
      stepByStep: [
        'Measure roof catchment area: Every 100 sq. meters yields approximately 55,000 to 70,000 liters per monsoon season in Western India.',
        'Install gutter slope of 1:100 towards the downspout to prevent sediment pooling.',
        'Place a first-flush diverter pipe with a floating ping-pong ball valve that seals automatically after filling the first 50 liters.',
        'Direct outflow to a masonry percolation chamber lined with coarse sand, coconut fiber/charcoal, and river gravel.',
        'Connect the filtered outlet to either a sealed household sump or an aquifer injection pipe.'
      ],
      practicalTips: [
        'Always clean rooftop tiles or terrace floor thoroughly before the first pre-monsoon showers.',
        'Never connect kitchen or washroom greywater lines to the rainwater percolation pit.',
        'Inspect filter screen monthly during active monsoon months to clear leaves and bird feathers.'
      ],
      whenToCallPro: 'For deep borewell direct injection drilling to avoid contamination of deep aquifers.'
    }
  },

  // 14. Deep Traditional: Earthquake Resilient Masonry
  {
    id: 'earthquake-masonry',
    title: 'Low-Cost Earthquake-Resistant Masonry & Tie-Bands',
    category: 'Resilient Construction',
    difficulty: 'Community Scale',
    estimatedTime: 'Construction Stage',
    tagline: 'Seismic tie-bands, quoin interlocking & ductile mortar bonds',
    summary: 'Harnessing vernacular timber-laced masonry (Dhajji-Dewari and Taq) and Indian Standard seismic band guidelines to make brick and stone buildings ductile and shatter-resistant without expensive RCC framing.',
    toolsNeeded: ['Mason trowel', 'Plumb bob', 'Bar bender', 'Measuring tape'],
    materials: [
      'Locally burned clay bricks or dressed quarry stone',
      'Hydraulic lime or lean cement-sand-lime composite mortar (1:1:6)',
      'High-yield GI seismic mesh (welded wire fabric) or treated bamboo laths',
      'Through-stones / bond stones (spanning 75% wall thickness)',
      'Precast or cast-in-situ reinforced concrete / timber tie-bands'
    ],
    bulletPoints: [
      'Continuous Horizontal Seismic Bands: Casting continuous reinforced bands at plinth level, lintel level, and roof eaves level binds the structure into an integral rigid box.',
      'Through-Stones (Patthar Bandh): Inserting transverse stones at 1.2m horizontal and 0.6m vertical intervals prevents delamination of multi-wythe rubble masonry under cyclic lateral shaking.',
      'Corner Interlocking & Quoins: Staggered, alternating corner blocks with hooked mesh reinforcements prevent corner tearing during shear stress.',
      'Controlled Opening Ratios: Window and door openings kept at least 60cm away from building corners, ensuring adequate solid masonry shear piers.',
      'Flexible Lime-Pozzolana Mortars: Replacing rigid brittle high-cement mortars with lime composites provides micro-slip dissipation, absorbing seismic energy without brittle wall collapse.'
    ],
    deepDive: {
      origin: 'Derived from traditional Himalayan Dhajji-Dewari and Kashmiri Taq construction methods which survived catastrophic earthquakes in 1885 and 2005 where modern rigid concrete collapsed.',
      coreMechanism: 'Unreinforced masonry fails in shear and out-of-plane wall tilting. By confining walls using continuous horizontal bands at lintel and plinth heights and anchoring corners with through-stones, lateral earthquake inertia is uniformly distributed.',
      stepByStep: [
        'Siting & Foundation: Step-trench foundation on firm soil with a minimum 450mm width and compacted stone bed.',
        'Plinth Band: Cast continuous 75mm band reinforced with two 8mm steel bars or heavy bamboo splits along external and cross walls.',
        'Corner Lacing: At all L and T wall junctions, embed 600mm long GI wire mesh or mild steel dowels every third brick course.',
        'Lintel Band: Unify all door and window heads in a singular continuous lintel beam running around the entire perimeter.',
        'Gable Bracing: Fasten masonry gable triangles to roof purlins or replace with lightweight diagonal braced timber paneling.'
      ],
      practicalTips: [
        'Do not exceed a building height of 2 storeys for unreinforced load-bearing masonry in seismic zones III & IV.',
        'Keep total horizontal length of window/door openings under 40% of the overall wall length.',
        'Cure lime-sand mortar walls with wet burlap for at least 14 days to maximize carbonation bond strength.'
      ],
      whenToCallPro: 'For multi-storey load calculations or when building on steep slopes and loose clay soils.'
    }
  }
];
