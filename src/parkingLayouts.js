 export const parkingLayouts = {
  1: {
    floors: {
      "G": {
        name: "Ground Floor",
        layout: [
          ["G1-C", "G2-C", null, "G3-E", "G4-S", "G5-C", "G6-C"],
          ["G7-C", "G8-C", null, "G9-E", "G10-S", "G11-C", "G12-C"],
          [null, null, "G13-C", "G14-C", "G15-S", null, null],
        ],
        vehicleSlots: {
          "G1-C": "car", "G2-C": "car", "G3-E": "ev", "G4-S": "suv",
          "G5-C": "car", "G6-C": "car", "G7-C": "car", "G8-C": "car",
          "G9-E": "ev", "G10-S": "suv", "G11-C": "car", "G12-C": "car",
          "G13-C": "car", "G14-C": "car", "G15-S": "suv"
        }
      },
      "1": {
        name: "First Floor", 
        layout: [
          ["1A-C", "1B-C", "1C-C", null, "1D-S", "1E-C", "1F-C"],
          ["1G-C", "1H-C", null, "1I-S", "1J-C", "1K-C", "1L-C"],
          ["1M-C", "1N-C", "1O-C", "1P-S", "1Q-C", "1R-C", "1S-C"],
        ],
        vehicleSlots: {
          "1A-C": "car", "1B-C": "car", "1C-C": "car", "1D-S": "suv",
          "1E-C": "car", "1F-C": "car", "1G-C": "car", "1H-C": "car",
          "1I-S": "suv", "1J-C": "car", "1K-C": "car", "1L-C": "car",
          "1M-C": "car", "1N-C": "car", "1O-C": "car", "1P-S": "suv",
          "1Q-C": "car", "1R-C": "car", "1S-C": "car"
        }
      },
      "2": {
        name: "Second Floor",
        layout: [
          ["2A-C", "2B-C", "2C-S", "2D-C", "2E-C"],
          ["2F-C", "2G-S", "2H-C", "2I-C", "2J-C"],
          ["2K-C", "2L-C", "2M-S", "2N-C", "2O-C"],
          ["2P-C", "2Q-C", "2R-S", "2S-C", "2T-C"],
        ],
        vehicleSlots: {
          "2A-C": "car", "2B-C": "car", "2C-S": "suv", "2D-C": "car", "2E-C": "car",
          "2F-C": "car", "2G-S": "suv", "2H-C": "car", "2I-C": "car", "2J-C": "car",
          "2K-C": "car", "2L-C": "car", "2M-S": "suv", "2N-C": "car", "2O-C": "car",
          "2P-C": "car", "2Q-C": "car", "2R-S": "suv", "2S-C": "car", "2T-C": "car"
        }
      }
    }
  },
  2: {
    floors: {
      "P1": {
        name: "Parking Level 1",
        layout: [
          ["P1-1C", "P1-2C", "P1-3B", null, "P1-4S"],
          ["P1-5C", "P1-6B", null, "P1-7S", "P1-8C"],
        ],
        vehicleSlots: {
          "P1-1C": "car", "P1-2C": "car", "P1-3B": "bike", "P1-4S": "suv",
          "P1-5C": "car", "P1-6B": "bike", "P1-7S": "suv", "P1-8C": "car"
        }
      },
      "P2": {
        name: "Parking Level 2", 
        layout: [
          ["P2-1C", "P2-2C", "P2-3B", "P2-4C"],
          ["P2-5C", "P2-6B", "P2-7C", "P2-8C"],
          ["P2-9C", "P2-10B", "P2-11C", "P2-12C"],
        ],
        vehicleSlots: {
          "P2-1C": "car", "P2-2C": "car", "P2-3B": "bike", "P2-4C": "car",
          "P2-5C": "car", "P2-6B": "bike", "P2-7C": "car", "P2-8C": "car",
          "P2-9C": "car", "P2-10B": "bike", "P2-11C": "car", "P2-12C": "car"
        }
      }
    }
  },
  3: {
    floors: {
      "B1": {
        name: "Basement 1",
        layout: [
          ["B1-1C", "B1-2B", "B1-3C", "B1-4B"],
          ["B1-5C", null, "B1-6B", "B1-7C"],
        ],
        vehicleSlots: {
          "B1-1C": "car", "B1-2B": "bike", "B1-3C": "car", "B1-4B": "bike",
          "B1-5C": "car", "B1-6B": "bike", "B1-7C": "car"
        }
      },
      "B2": {
        name: "Basement 2",
        layout: [
          ["B2-1C", "B2-2S", "B2-3C"],
          ["B2-4S", "B2-5C", "B2-6S"],
          ["B2-7C", "B2-8S", "B2-9C"],
        ],
        vehicleSlots: {
          "B2-1C": "car", "B2-2S": "suv", "B2-3C": "car",
          "B2-4S": "suv", "B2-5C": "car", "B2-6S": "suv",
          "B2-7C": "car", "B2-8S": "suv", "B2-9C": "car"
        }
      },
      "B3": {
        name: "Basement 3",
        layout: [
          ["B3-1E", "B3-2E", "B3-3E", "B3-4E", "B3-5E"],
          [null, "B3-6C", "B3-7C", "B3-8C", null],
        ],
        vehicleSlots: {
          "B3-1E": "ev", "B3-2E": "ev", "B3-3E": "ev", "B3-4E": "ev", "B3-5E": "ev",
          "B3-6C": "car", "B3-7C": "car", "B3-8C": "car"
        }
      },
      "B4": {
        name: "Basement 4",
        layout: [
          ["B4-1C", "B4-2B"],
          ["B4-3C", "B4-4B"],
          ["B4-5S", "B4-6B"],
          ["B4-7S", "B4-8B"],
        ],
        vehicleSlots: {
          "B4-1C": "car", "B4-2B": "bike", "B4-3C": "car", "B4-4B": "bike",
          "B4-5S": "suv", "B4-6B": "bike", "B4-7S": "suv", "B4-8B": "bike"
        }
      }
    }
  }
};