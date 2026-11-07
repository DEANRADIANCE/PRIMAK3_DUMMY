import { IHiradc } from "../types/hiradc";

export const initialHiradc: IHiradc[] = [
  {
    id: 1,
    parentActivity: "Menata Arsip",
    activity: "Menata Arsip Inaktif dan Statis di Ruang Penyimpanan",
    unit: "Direktorat Preservasi dan Pengolahan Arsip",
    location: "Depo Arsip Lt. 2 & Ruang Brankas Khusus",
    activityType: "Rutin (R)",
    hazardClassification: ["Safety (S)", "Health (H)"],
    assessor: "Tim K3 ANRI (Hendra Gunawan & Siti Rahmawati)",
    assessmentDate: "2026-02-20",

    selectedHazardTypes: ["Fisika", "Kimia", "Biologi", "Ergonomi", "Psikososial"],
    hazardDetails: {
      Fisika: [
        {
          id: "menata-fisika-1",
          deskripsi: "Ketinggian rak brankas (>2 meter), tangga lipat licin dan tidak stabil saat mengambil boks",
          risikoList: [
            "Terpeleset dan jatuh dari ketinggian",
            "Tertimpa boks arsip jatuh dari rak atas",
          ],
          dampakList: [
            "Fraktur / patah tulang ekstremitas",
            "Cedera kepala dan memar jaringan lunak",
          ],
          pengendalianList: [
            "Penyediaan tangga platform beroda dengan rem pengunci keselamatan",
            "Pemasangan handrail keselamatan di kedua sisi tangga",
            "Kewajiban safety shoes anti-slip dan sarung tangan katun bintik",
          ],
        },
        {
          id: "menata-fisika-2",
          deskripsi: "Pintu brankas baja tebal dan berat dengan titik jepit engsel (pinch point)",
          risikoList: [
            "Jari tangan terjepit engsel pintu brankas baja",
          ],
          dampakList: [
            "Luka robek, hematoma kuku, dan memar tulang",
          ],
          pengendalianList: [
            "Pemasangan sticker peringatan waspada titik jepit pada kusen brankas",
            "Instruksi kerja penutupan manual brankas dengan memegang handle pintu",
          ],
        },
      ],
      Kimia: [
        {
          id: "menata-kimia-1",
          deskripsi: "Debu partikel mikro kertas lapuk berumur puluhan tahun pada boks kardus arsip lama",
          risikoList: [
            "Terhirup partikel debu kertas lapuk secara terus-menerus",
          ],
          dampakList: [
            "Sesak napas alergi, rinitis kerja, dan batuk kronis",
          ],
        },
      ],
      Biologi: [
        {
          id: "menata-biologi-1",
          deskripsi: "Spora jamur mikroskopis dan serangga kutu buku pemakan serat kertas",
          risikoList: [
            "Kontak kulit dan inhalasi spora jamur saat membuka lembaran",
          ],
          dampakList: [
            "Dermatitis kontak alergi, infeksi jamur kulit, dan asma kerja",
          ],
        },
      ],
      Ergonomi: [
        {
          id: "menata-ergonomi-1",
          deskripsi: "Beban boks arsip berat (>15 kg) dengan posisi jinjit di atas tangga menjangkau rak",
          risikoList: [
            "Postur canggung (awkward posture) saat mengangkat beban di ketinggian",
            "Overexertion otot punggung dan bahu",
          ],
          dampakList: [
            "Hernia Nukleus Pulposus (HNP), Nyeri Punggung Bawah (Low Back Pain)",
          ],
        },
        {
          id: "menata-ergonomi-2",
          deskripsi: "Duduk membungkuk statis berjam-jam dan gerakan repetitif pergelangan tangan saat scanning",
          risikoList: [
            "Gerakan repetitif klik mouse dan pembalikan halaman",
          ],
          dampakList: [
            "Carpal Tunnel Syndrome (CTS) dan nyeri tengkuk leher",
          ],
        },
      ],
      Psikososial: [
        {
          id: "menata-psikososial-1",
          deskripsi: "Beban target digitalisasi ribuan lembar per hari dan kekhawatiran jatuh dari tangga",
          risikoList: [
            "Stres kerja dan kelelahan mental harian",
          ],
          dampakList: [
            "Insomnia, penurunan konsentrasi, dan burnout",
          ],
        },
      ],
    },

    controlDescriptions: [
      "Penyediaan tangga lipat aluminium standar dengan pijakan kokoh",
      "Penerapan instruksi kerja kehati-hatian manual sebelum memanjat rak",
      "Kewajiban penggunaan APD: masker kain penyaring debu dan sarung tangan katun bintik",
    ],
    controlDescription: "Tangga lipat aluminium, instruksi kerja kehati-hatian manual, masker kain & sarung tangan katun",
    selectedControls: ["Engineering Control", "Administrasi", "APD"],
    currentElimination: "-",
    currentSubstitution: "-",
    currentEngineering: "✓",
    currentAdministrative: "✓",
    currentApd: "✓",
    currentLikelihood: 4,
    currentSeverity: 3,
    currentNfr: 12,
    currentRiskLevel: "Tinggi",

    residualSelectedControls: ["Eliminasi", "Engineering Control", "Administrasi", "APD"],
    residualElimination: "✓",
    residualSubstitution: "-",
    residualEngineering: "✓",
    residualAdministrative: "✓",
    residualApd: "✓",
    residualLikelihood: 1,
    residualSeverity: 2,
    residualNfr: 2,
    residualRiskLevel: "Rendah",

    controlDuration: "14 Hari",
    controlStatus: "Open",
    responsiblePerson: "Koordinator Depo Arsip",
    targetDate: "2026-04-10",

    subActivities: [
      {
        id: "menata-1",
        activity: "Mengambil boks arsip dari brankas & rak tinggi (ketinggian > 2 meter)",
        location: "Depo Arsip Lt. 2 & Ruang Brankas",
        activityType: "Rutin (R)",
        hazardClassification: ["Safety (S)", "Health (H)"],
        selectedHazardTypes: ["Fisika", "Kimia", "Ergonomi"],
        hazardRows: [
          {
            id: "menata-row-1",
            deskripsi: "Ketinggian rak brankas (>2 meter), tangga lipat aluminium licin & postur jinjit angkat boks berat",
            jenisBahaya: ["Fisika", "Ergonomi"], // Centang Fisika & Ergonomi lebih dari 1!
            risikoList: [
              "Terpeleset dan jatuh dari tangga ketinggian > 2 meter",
              "Kehilangan keseimbangan saat menarik kardus arsip berat di atas bahu",
            ],
            dampakList: [
              "Fraktur / patah tulang ekstremitas (tangan/kaki)",
              "Trauma cedera kepala dan Nyeri Punggung Bawah (Low Back Pain)",
            ],
            pengendalianList: [
              "Penyediaan tangga platform beroda dengan rem pengunci & handrail ganda",
              "SOP manual handling: pembatasan beban angkat maksimal 10 kg per kardus",
              "Pemakaian safety shoes anti-slip dan sarung tangan katun bintik",
            ],
          },
          {
            id: "menata-row-2",
            deskripsi: "Debu partikel mikro kertas kuno lapuk berumur puluhan tahun dan bau uap pengawet kimia pada boks lama",
            jenisBahaya: ["Kimia", "Biologi"], // Centang Kimia & Biologi lebih dari 1!
            risikoList: [
              "Inhalasi debu partikel selulosa dan spora jamur kertas kuno",
              "Debu beterbangan masuk ke mata saat menurunkan boks",
            ],
            dampakList: [
              "Rinitis alergi kerja, batuk kronis, dan serangan asma kerja",
              "Konjungtivitis iritatif (mata merah dan pedih)",
            ],
            pengendalianList: [
              "Penggunaan masker respirator partikulat N95 saat handling boks arsip lama",
              "Penggunaan kacamata pelindung (safety goggles) saat menurunkan boks dari rak",
              "Pemasangan exhaust ventilation dan air purifier di area depo arsip",
            ],
          },
          {
            id: "menata-row-3",
            deskripsi: "Benda jatuh dari rak atas (kejatuhan bundel map arsip & boks kardus tebal)",
            jenisBahaya: ["Fisika"],
            risikoList: [
              "Tertimpa boks atau map arsip jatuh dari ketinggian rak",
            ],
            dampakList: [
              "Cedera leher, dislokasi bahu, dan luka robek kulit kepala",
            ],
            pengendalianList: [
              "Pemasangan bibir pengaman (safety stopper bar) pada bibir rak brankas",
              "Kewajiban penggunaan helm keselamatan (safety helmet) ringan di depo",
            ],
          },
        ],
        hazardDetails: {
          Fisika: [
            {
              id: "menata-sub1-fisika-1",
              deskripsi: "Ketinggian rak brankas (>2 meter), tangga lipat aluminium licin & tidak stabil saat mengambil boks",
              risikoList: [
                "Terpeleset dan jatuh dari tangga ketinggian > 2 meter",
                "Kehilangan keseimbangan saat menarik kardus arsip berat",
              ],
              dampakList: [
                "Fraktur / patah tulang ekstremitas (tangan/kaki)",
                "Trauma cedera kepala dan luka memar jaringan lunak",
              ],
              pengendalianList: [
                "Tangga platform beroda dengan rem pengunci keselamatan",
                "Instruksi kerja aman: batas injakan tangga maksimal",
                "Safety shoes anti-slip dan sarung tangan katun bintik",
              ],
            },
            {
              id: "menata-sub1-fisika-2",
              deskripsi: "Benda jatuh dari rak atas (kejatuhan bundel map arsip & boks kardus tebal)",
              risikoList: [
                "Tertimpa boks atau map arsip jatuh dari ketinggian rak",
                "Refleks menghindar mendadak yang memicu hilang keseimbangan di tangga",
              ],
              dampakList: [
                "Cedera leher, dislokasi bahu, dan luka robek kulit kepala",
                "Luka memar hematoma",
              ],
              pengendalianList: [
                "Pemasangan safety stopper bar pada bibir rak brankas",
                "Kewajiban helm keselamatan ringan saat beraktivitas di rak tinggi",
              ],
            },
          ],
          Kimia: [
            {
              id: "menata-sub1-kimia-1",
              deskripsi: "Debu partikel mikro kertas kuno lapuk berumur puluhan tahun pada kardus boks lama",
              risikoList: [
                "Inhalasi debu partikel selulosa kertas lapuk ke saluran pernapasan",
                "Debu beterbangan masuk ke mata saat menurunkan boks dari rak atas",
              ],
              dampakList: [
                "Rinitis alergi kerja, batuk kronis, dan serangan asma kerja",
                "Konjungtivitis iritatif (mata merah, pedih, dan berair)",
              ],
              pengendalianList: [
                "Masker respirator debu N95 / KN95 dengan efisiensi filtrasi tinggi",
                "Safety glasses / goggles anti-debu",
                "Pembersihan permukaan boks dengan vacuum cleaner ber-filter HEPA",
              ],
            },
            {
              id: "menata-sub1-kimia-2",
              deskripsi: "Uap sisa bahan kimia kamfer / naftalena dan pengawet kertas kuno di dalam brankas tertutup",
              risikoList: [
                "Terhirup gas uap naftalena pekat saat pintu brankas baru dibuka",
                "Kontak uap pekat pada selaput lendir saluran napas",
              ],
              dampakList: [
                "Pusing, mual akut, dan sakit kepala (cephalgia)",
                "Iritasi mukosa hidung dan tenggorokan",
              ],
              pengendalianList: [
                "Pembukaan pintu brankas 15 menit sebelum aktivitas dimulai untuk ventilasi",
                "Pengoperasian exhaust fan ruang arsip secara aktif",
              ],
            },
          ],
          Ergonomi: [
            {
              id: "menata-sub1-ergonomi-1",
              deskripsi: "Beban boks berat (>15kg), postur jinjit dan menjangkau di atas bahu",
              risikoList: [
                "Postur canggung saat menarik boks di atas kepala",
                "Kehilangan keseimbangan di tangga",
              ],
              dampakList: [
                "Cedera punggung bawah (Low Back Pain) dan sprain bahu",
              ],
              pengendalianList: [
                "Pembagian isi boks arsip maksimal 10 kg per kardus",
                "Pengangkatan bersama (berdua) untuk boks berbobot berat",
                "Pelatihan teknik manual handling posisi ergonomis yang tepat",
              ],
            },
          ],
        },
        hazardPhysics: "Ketinggian rak brankas (>2m), risiko tangga licin / tidak stabil",
        hazardChemical: "Debu partikel kertas lapuk pada kardus boks lama",
        hazardBiology: "Spora jamur dan serangga kutu buku pada berkas lama",
        hazardErgonomics: "Beban boks berat (>15kg), postur jinjit dan menjangkau di atas bahu",
        hazardPsychosocial: "Kekhawatiran jatuh saat memegang boks di atas tangga",
        riskImpact: "Jatuh dari ketinggian, tertimpa boks arsip, cedera punggung & bahu (muskuloskeletal)",

        controlDescriptions: [
          "Tangga lipat aluminium standar dengan penguncian manual",
          "Briefing instruksi lisan kehati-hatian saat mengambil boks berat",
          "Penggunaan sarung tangan katun bintik untuk daya cengkeram boks",
        ],
        controlDescription: "Tangga lipat aluminium biasa dan instruksi lisan",
        selectedControls: ["Engineering Control", "Administrasi", "APD"],
        currentElimination: "-",
        currentSubstitution: "-",
        currentEngineering: "✓",
        currentAdministrative: "✓",
        currentApd: "✓",
        currentLikelihood: 4,
        currentSeverity: 3,
        currentNfr: 12,
        currentRiskLevel: "Tinggi",

        residualSelectedControls: ["Eliminasi", "Engineering Control", "Administrasi", "APD"],
        residualElimination: "✓",
        residualSubstitution: "-",
        residualEngineering: "✓",
        residualAdministrative: "✓",
        residualApd: "✓",
        residualLikelihood: 1,
        residualSeverity: 2,
        residualNfr: 2,
        residualRiskLevel: "Rendah",

        controlDuration: "14 Hari",
        controlStatus: "Open",
        responsiblePerson: "Koordinator Depo Arsip",
        targetDate: "2026-03-25",
      },
      {
        id: "menata-2",
        activity: "Melakukan pembersihan debu, scanning digital & entri data arsip",
        location: "Ruang Pengolahan Arsip Lt. 2",
        activityType: "Rutin (R)",
        hazardClassification: ["Health (H)"],
        selectedHazardTypes: ["Fisika", "Kimia", "Biologi", "Ergonomi", "Psikososial"],
        hazardRows: [
          {
            id: "menata-sub2-row-1",
            deskripsi: "Pencahayaan layar scanner intensif dan pantulan silau monitor komputer",
            jenisBahaya: ["Fisika", "Ergonomi"],
            risikoList: [
              "Mata terpapar intensitas cahaya monitor scanner konstan",
              "Ketegangan saraf optik dan postur leher condong ke depan",
            ],
            dampakList: [
              "Astenopia (mata lelah), penglihatan kabur, sakit kepala migrain",
            ],
            pengendalianList: [
              "Pemasangan filter anti-glare pada monitor komputer dan layar pemindai",
              "Penerapan jeda istirahat mata 20-20-20 (tiap 20 menit lihat jauh 20 kaki)",
              "Pengaturan intensitas pencahayaan ruangan standar 300 lux",
            ],
          },
          {
            id: "menata-sub2-row-2",
            deskripsi: "Partikel debu mikro kertas kuno lapuk dan spora jamur mikroskopis saat lembaran dibalik satu per satu",
            jenisBahaya: ["Kimia", "Biologi"],
            risikoList: [
              "Inhalasi debu partikel halus ke bronkus dan saluran napas",
              "Spora jamur kuno terhirup dan menempel pada kulit tangan",
            ],
            dampakList: [
              "Rinitis alergi kerja, batuk kronis, sesak napas (asma kerja)",
              "Dermatitis kontak dan gatal-gatal pada kulit pergelangan tangan",
            ],
            pengendalianList: [
              "Penyediaan dan kewajiban masker respirator partikulat N95 / KN95",
              "Penggunaan sarung tangan nitril sekali pakai saat menangani berkas rapuh",
              "Penyediaan air purifier dengan filter HEPA di ruang pemindaian",
            ],
          },
          {
            id: "menata-sub2-row-3",
            deskripsi: "Duduk statis membungkuk berjam-jam dan gerakan pergelangan tangan repetitif (mouse & scan)",
            jenisBahaya: ["Ergonomi", "Psikososial"],
            risikoList: [
              "Beban statis ruas tulang belakang lumbosakral",
              "Kompresi nervus medianus pada pergelangan tangan akibat klik mouse ribuan kali",
              "Beban target kuantitas scanning ribuan halaman per hari",
            ],
            dampakList: [
              "Carpal Tunnel Syndrome (CTS), nyeri punggung bawah (Low Back Pain)",
              "Kelelahan psikologis dan penurunan konsentrasi kerja",
            ],
            pengendalianList: [
              "Penyediaan kursi ergonomis dengan penopang pinggang (lumbar support) & armrest",
              "Penggunaan mousepad gel ergonomis dan mouse vertikal anti-CTS",
              "Instruksi peregangan otot (stretching) wajib setiap 2 jam kerja",
            ],
          },
        ],
        hazardDetails: {
          Fisika: [
            {
              id: "menata-sub2-fisika-1",
              deskripsi: "Pencahayaan layar scanner intensif dan pantulan silau monitor komputer",
              risikoList: ["Mata terpapar intensitas cahaya monitor konstan"],
              dampakList: ["Astenopia (mata lelah), penglihatan kabur, sakit kepala"],
            },
          ],
          Kimia: [
            {
              id: "menata-sub2-kimia-1",
              deskripsi: "Partikel debu mikro kertas lapuk berumur puluhan tahun beterbangan saat scanning",
              risikoList: ["Inhalasi debu partikel halus ke bronkus"],
              dampakList: ["Iritasi saluran pernapasan atas, batuk kronis"],
            },
          ],
          Biologi: [
            {
              id: "menata-sub2-biologi-1",
              deskripsi: "Debu alergen dan spora jamur kuno saat lembaran dibuka satu per satu",
              risikoList: ["Spora jamur terhirup dan kontak kulit"],
              dampakList: ["Reaksi alergi pernapasan dan gatal-gatal pada kulit"],
            },
          ],
          Ergonomi: [
            {
              id: "menata-sub2-ergonomi-1",
              deskripsi: "Duduk statis membungkuk berjam-jam, gerakan pergelangan tangan repetitif (mouse & scan)",
              risikoList: ["Beban statis tulang belakang dan kompresi nervus medianus"],
              dampakList: ["Carpal Tunnel Syndrome (CTS), nyeri punggung bawah kronis"],
            },
          ],
          Psikososial: [
            {
              id: "menata-sub2-psikososial-1",
              deskripsi: "Beban target scan ribuan halaman per hari, kelelahan mental",
              risikoList: ["Tekanan target kuantitas lembar scan harian"],
              dampakList: ["Kelelahan psikologis, stres kerja, penurunan fokus"],
            },
          ],
        },
        hazardPhysics: "Pencahayaan layar scanner intensif dan silau monitor komputer",
        hazardChemical: "Partikel debu mikro kertas lapuk berumur puluhan tahun",
        hazardBiology: "Debu alergen & jamur kertas kuno saat lembaran dibuka satu per satu",
        hazardErgonomics: "Duduk statis membungkuk berjam-jam, gerakan pergelangan tangan repetitif (mouse & flip scanner)",
        hazardPsychosocial: "Beban target scan ribuan halaman per hari, kelelahan mental",
        riskImpact: "Sindrom Carpal Tunnel (CTS), mata lelah (asthenopia), sesak napas alergi (asma kerja), nyeri punggung bawah",

        controlDescriptions: [
          "Meja kerja dan kursi kantor standar ergonomi dasar",
          "Pengaturan rotasi jeda istirahat peregangan mata dan otot setiap 2 jam",
          "Pencahayaan lampu kerja tambahan di meja pemindaian arsip",
        ],
        controlDescription: "Meja kursi kantor biasa dan waktu kerja standar",
        selectedControls: ["Engineering Control", "Administrasi", "APD"],
        currentElimination: "-",
        currentSubstitution: "-",
        currentEngineering: "✓",
        currentAdministrative: "✓",
        currentApd: "✓",
        currentLikelihood: 3,
        currentSeverity: 3,
        currentNfr: 9,
        currentRiskLevel: "Sedang",

        residualSelectedControls: ["Engineering Control", "Administrasi", "APD"],
        residualElimination: "-",
        residualSubstitution: "-",
        residualEngineering: "✓",
        residualAdministrative: "✓",
        residualApd: "✓",
        residualLikelihood: 1,
        residualSeverity: 2,
        residualNfr: 2,
        residualRiskLevel: "Rendah",

        controlDuration: "30 Hari",
        controlStatus: "Open",
        responsiblePerson: "Siti Rahmawati (Tim K3)",
        targetDate: "2026-04-10",
      },
      {
        id: "menata-3",
        activity: "Penyusunan kembali berkas, pelabelan boks, dan penguncian brankas",
        location: "Ruang Brankas Khusus Lt. 2",
        activityType: "Rutin (R)",
        hazardClassification: ["Safety (S)"],
        selectedHazardTypes: ["Fisika", "Ergonomi"],
        hazardRows: [
          {
            id: "menata-sub3-row-1",
            deskripsi: "Pintu brankas baja tebal dan berat dengan celah engsel sempit (pinch point)",
            jenisBahaya: ["Fisika"],
            risikoList: [
              "Jari tangan terjepit celah engsel pintu brankas baja",
              "Tertimpa daun pintu brankas saat menutup secara mendadak",
            ],
            dampakList: [
              "Memar tulang, luka robek, fraktur falang distal jari tangan",
            ],
            pengendalianList: [
              "Instruksi kerja penutupan manual brankas dengan memegang handle khusus (dilarang memegang kusen)",
              "Pemasangan sticker peringatan waspada titik jepit (pinch point danger) kuning-hitam",
              "Pemasangan peredam hidrolik / door stopper pada daun pintu brankas baja",
            ],
          },
          {
            id: "menata-sub3-row-2",
            deskripsi: "Mendorong daun pintu brankas berat dan mengangkat boks arsip ke rak brankas",
            jenisBahaya: ["Ergonomi"],
            risikoList: [
              "Gaya dorong berlebih pada sendi bahu dan siku",
              "Beban angkat kardus arsip berulang pada posisi ruang terbatas",
            ],
            dampakList: [
              "Ketegangan otot bahu (shoulder strain), spasme otot punggung",
            ],
            pengendalianList: [
              "Pelumasan rutin engsel dan gerendel pintu brankas setiap 3 bulan agar lancar didorong",
              "Penggunaan troli dorong mini untuk transfer boks arsip ke rak simpan",
              "Penetapan kapasitas maksimal boks simpan tidak melebihi 10 kg",
            ],
          },
        ],
        hazardDetails: {
          Fisika: [
            {
              id: "menata-sub3-fisika-1",
              deskripsi: "Pintu brankas baja tebal dan berat dengan celah engsel sempit (pinch point)",
              risikoList: ["Jari tangan terjepit engsel pintu brankas baja"],
              dampakList: ["Memar tulang, luka robek, fraktur falang distal"],
            },
          ],
          Ergonomi: [
            {
              id: "menata-sub3-ergonomi-1",
              deskripsi: "Mendorong daun pintu brankas berat dan memindahkan boks ke rak",
              risikoList: ["Gaya dorong berlebih pada sendi bahu dan siku"],
              dampakList: ["Ketegangan otot bahu (shoulder strain)"],
            },
          ],
        },
        hazardPhysics: "Pintu brankas baja tebal dan berat (risiko pinch point / terjepit)",
        hazardChemical: "-",
        hazardBiology: "-",
        hazardErgonomics: "Mendorong daun pintu brankas berat dan memindahkan boks ke rak",
        hazardPsychosocial: "Tanggung jawab keamanan dokumen arsip rahasia negara",
        riskImpact: "Jari tangan terjepit engsel pintu brankas baja, memar tulang, cedera otot",

        controlDescriptions: [
          "Instruksi kerja penutupan manual brankas dengan dua personel",
          "Inspeksi engsel dan gerendel pintu brankas secara berkala",
        ],
        controlDescription: "Instruksi kerja penutupan manual brankas",
        selectedControls: ["Engineering Control", "Administrasi"],
        currentElimination: "-",
        currentSubstitution: "-",
        currentEngineering: "✓",
        currentAdministrative: "✓",
        currentApd: "-",
        currentLikelihood: 3,
        currentSeverity: 3,
        currentNfr: 9,
        currentRiskLevel: "Sedang",

        residualSelectedControls: ["Engineering Control", "Administrasi", "APD"],
        residualElimination: "-",
        residualSubstitution: "-",
        residualEngineering: "✓",
        residualAdministrative: "✓",
        residualApd: "✓",
        residualLikelihood: 1,
        residualSeverity: 1,
        residualNfr: 1,
        residualRiskLevel: "Rendah",

        controlDuration: "7 Hari",
        controlStatus: "Close",
        responsiblePerson: "Kepala Subbagian Arsiparis",
        targetDate: "2026-03-15",
      },
    ],

    hazardPhysics: "Ketinggian rak brankas (>2m) & pintu brankas baja berat",
    hazardChemical: "Debu partikel mikro kertas lapuk pada kardus arsip lama",
    hazardBiology: "Spora jamur kertas kuno dan serangga kutu buku",
    hazardErgonomics: "Beban boks berat (>15kg), postur jinjit di atas tangga, gerakan repetitif scanning",
    hazardPsychosocial: "Kekhawatiran jatuh dari tangga & kelelahan target ribuan lembar scan",
    riskImpact: "Jatuh dari tangga, tertimpa boks arsip, cedera muskuloskeletal, CTS & gangguan napas",

    hazard: "Ketinggian rak brankas, manual handling boks arsip berat, dan debu kertas lapuk",
    risk: "Jatuh dari tangga, cedera muskuloskeletal, sindrom Carpal Tunnel, iritasi saluran napas",
    category: "Safety (S), Health (H)",
    likelihood: 4,
    severity: 3,
    riskScore: 12,
    riskLevel: "high",
    existingControl: "Tangga lipat biasa, masker medis, sarung tangan katun",
    additionalControl: "Tangga safety platform dengan handrail, kursi ergonomis lumbar support, respirator N95, pembatasan beban angkat",
    description: "Rangkaian penataan arsip statis dan inaktif yang meliputi pengambilan dari brankas, proses digitalisasi scan, dan penataan kembali ke lemari penyimpanan.",
    potentialImpact: "Kecelakaan kerja terjatuh dari ketinggian dan penyakit akibat kerja muskuloskeletal.",
    photos: [],
    status: "in_progress",
    statusHistory: [
      {
        status: "Draft",
        changedBy: "Hendra Gunawan",
        changedAt: "2026-02-20 09:00",
        notes: "Identifikasi bahaya menyeluruh tahapan penataan arsip sesuai format formulir Google Spreadsheet",
      },
      {
        status: "Reviewed",
        changedBy: "Siti Rahmawati",
        changedAt: "2026-02-22 13:00",
        notes: "Disetujui usulan pengadaan tangga safety platform & APD N95",
      },
    ],
    createdAt: "2026-02-20T09:00:00Z",
    updatedAt: "2026-02-22T13:00:00Z",
  },
  {
    id: 2,
    parentActivity: "Restorasi dan Fumigasi Arsip",
    activity: "Restorasi dan Fumigasi Arsip Kuno Berjamur",
    unit: "Direktorat Preservasi Arsip",
    location: "Laboratorium Preservasi Lantai 1 Gedung B",
    activityType: "Rutin (R)",
    hazardClassification: ["Health (H)", "Safety (S)"],
    assessor: "Tim K3 ANRI (Siti Rahmawati)",
    assessmentDate: "2026-02-15",

    selectedHazardTypes: ["Kimia", "Biologi", "Ergonomi"],
    hazardDetails: {
      Kimia: [
        {
          id: "fumigasi-kimia-1",
          deskripsi: "Paparan uap gas fumigan beracun (phosphine / methyl bromide) dalam proses sterilisasi",
          risikoList: [
            "Inhalasi uap fumigan gas beracun konsentrasi tinggi",
            "Kebocoran gas saat pembukaan bilik fumigasi",
          ],
          dampakList: [
            "Keracunan akut saluran pernapasan, edema paru, mual & pusing berat",
          ],
        },
      ],
      Biologi: [
        {
          id: "fumigasi-biologi-1",
          deskripsi: "Spora jamur mikroskopis aktif (aspergillus sp.) pada lembaran naskah kuno",
          risikoList: [
            "Terpapar spora jamur saat membersihkan permukaan kertas secara mekanis",
          ],
          dampakList: [
            "Aspergilosis paru, rinitis alergi, dan infeksi jamur kutan",
          ],
        },
      ],
      Ergonomi: [
        {
          id: "fumigasi-ergonomi-1",
          deskripsi: "Posisi berdiri dan membungkuk statis > 4 jam saat pembersihan lembaran naskah",
          risikoList: [
            "Postur leher dan punggung membungkuk statis",
          ],
          dampakList: [
            "Nyeri leher kronis (cervicalgia) dan kelelahan otot punggung",
          ],
        },
      ],
    },

    hazardPhysics: "Pencahayaan kurang optimal di ruang laboratorium",
    hazardChemical: "Paparan uap gas fumigan beracun (phosphine / methyl bromide)",
    hazardBiology: "Spora jamur mikroskopis aktif (aspergillus) pada kertas kuno",
    hazardErgonomics: "Posisi berdiri dan membungkuk statis saat pembersihan lembaran arsip",
    hazardPsychosocial: "Kekhawatiran terpapar zat berbahaya secara terus-menerus",
    riskImpact: "Gangguan pernapasan kronis, keracunan akut saluran napas, iritasi mata",

    controlDescriptions: [
      "Pengoperasian exhaust fan dinding ruang laboratorium secara berkala",
      "Pemasangan tanda peringatan bahaya kimia di pintu lab",
      "Penggunaan masker medis 3-ply dan sarung tangan lateks tipis",
    ],
    controlDescription: "Exhaust fan dinding, tanda bahaya kimia di pintu lab, masker medis & sarung tangan lateks tipis",
    selectedControls: ["Engineering Control", "Administrasi", "APD"],
    currentElimination: "-",
    currentSubstitution: "-",
    currentEngineering: "✓",
    currentAdministrative: "✓",
    currentApd: "✓",
    currentLikelihood: 3,
    currentSeverity: 4,
    currentNfr: 12,
    currentRiskLevel: "Tinggi",

    residualSelectedControls: ["Eliminasi", "Subtitusi", "Engineering Control", "Administrasi", "APD"],
    residualElimination: "✓",
    residualSubstitution: "✓",
    residualEngineering: "✓",
    residualAdministrative: "✓",
    residualApd: "✓",
    residualLikelihood: 1,
    residualSeverity: 3,
    residualNfr: 3,
    residualRiskLevel: "Sedang",

    controlDuration: "30 Hari",
    controlStatus: "Open",
    responsiblePerson: "Siti Rahmawati (Tim K3)",
    targetDate: "2026-04-15",

    subActivities: [
      {
        id: "fumigasi-1",
        activity: "Pengasapan / Fumigasi Bahan Arsip di Bilik Khusus",
        location: "Laboratorium Preservasi Lantai 1 Gedung B",
        activityType: "Rutin (R)",
        hazardClassification: ["Health (H)", "Safety (S)"],
        selectedHazardTypes: ["Kimia", "Biologi"],
        hazardDetails: {
          Kimia: [
            {
              id: "fum-sub1-kimia-1",
              deskripsi: "Paparan uap gas fumigan beracun (phosphine / methyl bromide)",
              risikoList: ["Kebocoran gas fumigan saat proses aerasi"],
              dampakList: ["Keracunan akut saluran napas, iritasi mata & bronkus"],
            },
          ],
          Biologi: [
            {
              id: "fum-sub1-biologi-1",
              deskripsi: "Spora jamur mikroskopis aktif (aspergillus)",
              risikoList: ["Spora jamur terlepas ke udara saat pemindahan boks"],
              dampakList: ["Aspergilosis pernapasan dan reaksi alergi kulit"],
            },
          ],
        },
        hazardPhysics: "-",
        hazardChemical: "Paparan uap gas fumigan beracun (phosphine / methyl bromide)",
        hazardBiology: "Spora jamur mikroskopis aktif (aspergillus) pada kertas kuno",
        hazardErgonomics: "-",
        hazardPsychosocial: "Kekhawatiran terpapar zat berbahaya secara terus-menerus",
        riskImpact: "Gangguan pernapasan kronis, keracunan akut saluran napas, iritasi mata",

        controlDescriptions: [
          "Exhaust fan dinding konvensional untuk sirkulasi udara ruang kerja",
          "Instruksi lisan pembatasan durasi kontak dengan bahan kimia arsip",
          "Masker pelindung debu dan sarung tangan katun",
        ],
        controlDescription: "Exhaust fan dinding konvensional",
        selectedControls: ["Engineering Control", "Administrasi", "APD"],
        currentElimination: "-",
        currentSubstitution: "-",
        currentEngineering: "✓",
        currentAdministrative: "✓",
        currentApd: "✓",
        currentLikelihood: 3,
        currentSeverity: 4,
        currentNfr: 12,
        currentRiskLevel: "Tinggi",

        residualSelectedControls: ["Eliminasi", "Subtitusi", "Engineering Control", "Administrasi", "APD"],
        residualElimination: "✓",
        residualSubstitution: "✓",
        residualEngineering: "✓",
        residualAdministrative: "✓",
        residualApd: "✓",
        residualLikelihood: 1,
        residualSeverity: 3,
        residualNfr: 3,
        residualRiskLevel: "Sedang",

        controlDuration: "30 Hari",
        controlStatus: "Open",
        responsiblePerson: "Siti Rahmawati (Tim K3)",
        targetDate: "2026-04-15",
      },
    ],

    hazard: "Paparan zat kimia fumigan (phosphine) dan spora jamur mikroskopis",
    risk: "Gangguan pernapasan kronis, keracunan akut, iritasi kulit/mata",
    category: "Health (H), Safety (S)",
    likelihood: 3,
    severity: 4,
    riskScore: 12,
    riskLevel: "high",
    existingControl: "Pemakaian masker medis standar dan sarung tangan lateks tipis",
    additionalControl: "Wajib menggunakan respirator particulate P100/gas canister full face, sarung tangan nitril tebal, ruang fumigasi dengan biosafety ventilation chamber khusus",
    description: "Kegiatan rutin sterilisasi dokumen kertas kuno peninggalan era kolonial yang terinfeksi jamur aktif.",
    potentialImpact: "Keracunan saluran pernapasan petugas laboratorium.",
    photos: [],
    status: "in_progress",
    statusHistory: [
      {
        status: "Draft",
        changedBy: "Siti Rahmawati",
        changedAt: "2026-02-15 10:00",
        notes: "Identifikasi bahaya dari surveilans berkala",
      },
      {
        status: "Reviewed",
        changedBy: "Ir. Hendra Gunawan",
        changedAt: "2026-02-18 14:00",
        notes: "Disetujui usulan pengadaan APD respirator",
      },
      {
        status: "Approved",
        changedBy: "Dr. Budi Santoso",
        changedAt: "2026-02-20 09:30",
        notes: "Penganggaran APD tingkat lanjut dialokasikan",
      },
    ],
    createdAt: "2026-02-15T10:00:00Z",
    updatedAt: "2026-02-20T09:30:00Z",
  },
  {
    id: 3,
    parentActivity: "Pengangkutan Berkas Arsip Boks Berat",
    activity: "Pengangkutan Berkas Arsip Boks Berat antar Gedung",
    unit: "Direktorat Pengolahan Arsip",
    location: "Depo Arsip Utama Gedung C",
    activityType: "Rutin (R)",
    hazardClassification: ["Safety (S)", "Health (H)"],
    assessor: "Ahmad Fauzi (Tim K3)",
    assessmentDate: "2026-02-10",

    selectedHazardTypes: ["Fisika", "Ergonomi"],
    hazardDetails: {
      Fisika: [
        {
          id: "angkut-fisika-1",
          deskripsi: "Permukaan lantai licin dan jalur undakan tangga curam antar gedung",
          risikoList: [
            "Terpeleset dan tersandung di tangga saat membawa beban",
            "Tertimpa tumpukan boks yang terlepas dari genggaman",
          ],
          dampakList: [
            "Sprain ankle (keseleo pergelangan kaki), memar betis, dan robek ligamen",
          ],
        },
      ],
      Ergonomi: [
        {
          id: "angkut-ergonomi-1",
          deskripsi: "Manual handling pengangkatan beban berlebih (>20 kg per boks) secara repetitif",
          risikoList: [
            "Beban biomekanik berlebih pada vertebra L4-L5 saat membungkuk",
            "Keletihan otot pinggang akut",
          ],
          dampakList: [
            "Low Back Pain (LBP), Herniasi Diskus, spasme otot lumbal berat",
          ],
        },
      ],
    },

    hazardPhysics: "Lantai licin dan undakan tangga antar gedung",
    hazardChemical: "Debu partikulat kertas kering lama",
    hazardBiology: "Kutu buku dan serangga rayap pada boks kardus tua",
    hazardErgonomics: "Manual handling beban berlebih (>20 kg per boks) secara berulang",
    hazardPsychosocial: "Target pemindahan ribuan boks dalam tenggat waktu sempit",
    riskImpact: "Cedera tulang belakang (Low Back Pain), herniasi diskus servikal, terkilir, tertimpa boks arsip",

    controlDescriptions: [
      "Pengangkatan manual berpasangan (2 orang per boks arsip berat)",
      "Briefing teknik pengangkatan aman (menekuk lutut, tulang punggung tegak)",
      "Penggunaan sarung tangan katun rajut dengan grip karet anti-slip",
    ],
    controlDescription: "Pengangkatan manual oleh 2 orang dan sarung tangan katun rajut",
    selectedControls: ["Administrasi", "APD"],
    currentElimination: "-",
    currentSubstitution: "-",
    currentEngineering: "-",
    currentAdministrative: "✓",
    currentApd: "✓",
    currentLikelihood: 4,
    currentSeverity: 3,
    currentNfr: 12,
    currentRiskLevel: "Tinggi",

    residualSelectedControls: ["Eliminasi", "Engineering Control", "Administrasi", "APD"],
    residualElimination: "✓",
    residualSubstitution: "-",
    residualEngineering: "✓",
    residualAdministrative: "✓",
    residualApd: "✓",
    residualLikelihood: 2,
    residualSeverity: 2,
    residualNfr: 4,
    residualRiskLevel: "Sedang",

    controlDuration: "14 Hari",
    controlStatus: "Open",
    responsiblePerson: "Ahmad Fauzi",
    targetDate: "2026-03-30",

    subActivities: [
      {
        id: "angkut-1",
        activity: "Pengangkatan Manual dan Mobilisasi Boks Arsip antar Gedung",
        location: "Depo Arsip Utama Gedung C",
        activityType: "Rutin (R)",
        hazardClassification: ["Safety (S)", "Health (H)"],
        selectedHazardTypes: ["Fisika", "Ergonomi"],
        hazardRows: [
          {
            id: "menata-sub3-row-1",
            deskripsi: "Pintu brankas baja tebal dan berat dengan celah engsel sempit (pinch point)",
            jenisBahaya: ["Fisika"],
            risikoList: [
              "Jari tangan terjepit celah engsel pintu brankas baja",
              "Tertimpa daun pintu brankas saat menutup secara mendadak",
            ],
            dampakList: [
              "Memar tulang, luka robek, fraktur falang distal jari tangan",
            ],
            pengendalianList: [
              "Instruksi kerja penutupan manual brankas dengan memegang handle khusus (dilarang memegang kusen)",
              "Pemasangan sticker peringatan waspada titik jepit (pinch point danger) kuning-hitam",
              "Pemasangan peredam hidrolik / door stopper pada daun pintu brankas baja",
            ],
          },
          {
            id: "menata-sub3-row-2",
            deskripsi: "Mendorong daun pintu brankas berat dan mengangkat boks arsip ke rak brankas",
            jenisBahaya: ["Ergonomi"],
            risikoList: [
              "Gaya dorong berlebih pada sendi bahu dan siku",
              "Beban angkat kardus arsip berulang pada posisi ruang terbatas",
            ],
            dampakList: [
              "Ketegangan otot bahu (shoulder strain), spasme otot punggung",
            ],
            pengendalianList: [
              "Pelumasan rutin engsel dan gerendel pintu brankas setiap 3 bulan agar lancar didorong",
              "Penggunaan troli dorong mini untuk transfer boks arsip ke rak simpan",
              "Penetapan kapasitas maksimal boks simpan tidak melebihi 10 kg",
            ],
          },
        ],
        hazardDetails: {
          Fisika: [
            {
              id: "angkut-sub1-fisika-1",
              deskripsi: "Lantai licin dan undakan tangga antar gedung",
              risikoList: ["Terpeleset dan tertimpa boks arsip berat"],
              dampakList: ["Terkilir pergelangan kaki, memar lutut & tungkai"],
            },
          ],
          Ergonomi: [
            {
              id: "angkut-sub1-ergonomi-1",
              deskripsi: "Manual handling beban berlebih (>20 kg per boks) secara berulang",
              risikoList: ["Kompresi bantalan tulang belakang berulang"],
              dampakList: ["Low Back Pain (LBP), cedera saraf tulang belakang"],
            },
          ],
        },
        hazardPhysics: "Lantai licin dan undakan tangga antar gedung",
        hazardChemical: "-",
        hazardBiology: "-",
        hazardErgonomics: "Manual handling beban berlebih (>20 kg per boks) secara berulang",
        hazardPsychosocial: "-",
        riskImpact: "Cedera tulang belakang (Low Back Pain), herniasi diskus, terkilir",

        controlDescriptions: [
          "Pengangkatan manual berdua untuk boks dengan berat di atas 15 kg",
          "Penggunaan troli dorong manual beroda empat",
          "Sarung tangan kerja kain rajut tebal",
        ],
        controlDescription: "Pengangkatan manual berdua",
        selectedControls: ["Administrasi", "APD"],
        currentElimination: "-",
        currentSubstitution: "-",
        currentEngineering: "-",
        currentAdministrative: "✓",
        currentApd: "✓",
        currentLikelihood: 4,
        currentSeverity: 3,
        currentNfr: 12,
        currentRiskLevel: "Tinggi",

        residualSelectedControls: ["Eliminasi", "Engineering Control", "Administrasi", "APD"],
        residualElimination: "✓",
        residualSubstitution: "-",
        residualEngineering: "✓",
        residualAdministrative: "✓",
        residualApd: "✓",
        residualLikelihood: 2,
        residualSeverity: 2,
        residualNfr: 4,
        residualRiskLevel: "Sedang",

        controlDuration: "14 Hari",
        controlStatus: "Open",
        responsiblePerson: "Ahmad Fauzi",
        targetDate: "2026-03-30",
      },
    ],

    hazard: "Manual handling beban berlebih (>20 kg) tanpa alat angkut mekanis",
    risk: "Cedera tulang belakang (Low Back Pain), herniasi diskus, terkilir",
    category: "Safety (S), Health (H)",
    likelihood: 4,
    severity: 3,
    riskScore: 12,
    riskLevel: "high",
    existingControl: "Pengangkatan manual oleh 2 orang",
    additionalControl: "Penyediaan hand truck trolley hidrolik ergonomis, pembatasan berat maksimal per boks (12 kg), pelatihan ergonomi manual handling",
    description: "Pemindahan berkas inaktif dalam volume besar dari lantai dasar ke lantai 3.",
    potentialImpact: "Penyakit akibat kerja muskuloskeletal pada petugas arsiparis.",
    photos: [],
    status: "in_progress",
    statusHistory: [
      {
        status: "Draft",
        changedBy: "Ahmad Fauzi",
        changedAt: "2026-02-10 11:00",
      },
      {
        status: "Approved",
        changedBy: "Dr. Budi Santoso",
        changedAt: "2026-02-14 16:00",
      },
    ],
    createdAt: "2026-02-10T11:00:00Z",
    updatedAt: "2026-02-14T16:00:00Z",
  },
  {
    id: 4,
    parentActivity: "Pemeliharaan Instalasi Listrik Panel Trafo Utama",
    activity: "Pemeliharaan Instalasi Listrik Panel Trafo Utama",
    unit: "Subbagian Rumah Tangga dan Sarpras",
    location: "Ruang Panel Daya Listrik Gedung Utama",
    activityType: "Non Rutin (NR)",
    hazardClassification: ["Safety (S)"],
    assessor: "Siti Rahmawati (Tim K3)",
    assessmentDate: "2026-03-01",

    selectedHazardTypes: ["Fisika", "Kimia", "Psikososial"],
    hazardDetails: {
      Fisika: [
        {
          id: "trafo-fisika-1",
          deskripsi: "Tegangan tinggi 380V - 20kV dan percikan busur api (arc flash hazard) pada busbar terbuka",
          risikoList: [
            "Tersengat aliran listrik tegangan menengah/tinggi",
            "Terpapar ledakan busur api listrik (arc flash blast)",
          ],
          dampakList: [
            "Kematian akibat sengatan listrik (electrocution fatal), luka bakar derajat 3",
          ],
        },
      ],
      Kimia: [
        {
          id: "trafo-kimia-1",
          deskripsi: "Residu asap isolasi kabel terbakar dan gas ozon pekat",
          risikoList: [
            "Terhirup asap pekat hasil isolasi kabel",
          ],
          dampakList: [
            "Iritasi bronkus akut dan sesak napas toksik",
          ],
        },
      ],
      Psikososial: [
        {
          id: "trafo-psikososial-1",
          deskripsi: "Bekerja di bawah stres risiko tinggi kematian dalam ruang sempit",
          risikoList: [
            "Kepanikan dan tekanan psikologis ekstrem teknisi",
          ],
          dampakList: [
            "Kehilangan fokus, tremor tangan yang memicu sentuhan tak sengaja",
          ],
        },
      ],
    },

    hazardPhysics: "Tegangan tinggi 380V - 20kV, medan elektromagnetik kuat, panas busur api listrik",
    hazardChemical: "Gas ozon dan residu pembakaran isolasi kabel",
    hazardBiology: "-",
    hazardErgonomics: "Ruang kerja terbatas (confined narrow panel cubicle)",
    hazardPsychosocial: "Tekanan mental tinggi menghadapi pekerjaan bahaya fatal",
    riskImpact: "Sengatan listrik fatal (electrocution), luka bakar derajat 3 akibat arc flash, ledakan panel",

    controlDescriptions: [
      "Pintu panel listrik terkunci dengan gembok manual",
      "Pemasangan tanda bahaya tegangan tinggi (Danger High Voltage)",
      "Penggunaan safety shoes bersol karet anti-statis",
    ],
    controlDescription: "Pintu panel terkunci konvensional, tanda bahaya tegangan tinggi, safety shoes karet",
    selectedControls: ["Engineering Control", "Administrasi", "APD"],
    currentElimination: "-",
    currentSubstitution: "-",
    currentEngineering: "✓",
    currentAdministrative: "✓",
    currentApd: "✓",
    currentLikelihood: 4,
    currentSeverity: 5,
    currentNfr: 20,
    currentRiskLevel: "Sangat Tinggi",

    residualSelectedControls: ["Eliminasi", "Engineering Control", "Administrasi", "APD"],
    residualElimination: "✓",
    residualSubstitution: "-",
    residualEngineering: "✓",
    residualAdministrative: "✓",
    residualApd: "✓",
    residualLikelihood: 1,
    residualSeverity: 2,
    residualNfr: 2,
    residualRiskLevel: "Rendah",

    controlDuration: "7 Hari",
    controlStatus: "Close",
    responsiblePerson: "Siti Rahmawati (Tim K3)",
    targetDate: "2026-03-25",

    subActivities: [
      {
        id: "trafo-1",
        activity: "Pemeriksaan dan Pembersihan Busbar Kubikel Panel Trafo",
        location: "Ruang Panel Daya Listrik Gedung Utama",
        activityType: "Non Rutin (NR)",
        hazardClassification: ["Safety (S)"],
        selectedHazardTypes: ["Fisika", "Kimia"],
        hazardDetails: {
          Fisika: [
            {
              id: "trafo-sub1-fisika-1",
              deskripsi: "Tegangan tinggi 380V - 20kV, medan elektromagnetik kuat, panas busur api listrik",
              risikoList: ["Sengatan listrik fatal dan ledakan busur api listrik"],
              dampakList: ["Kematian fatal (electrocution), luka bakar derajat 3 menyeluruh"],
            },
          ],
          Kimia: [
            {
              id: "trafo-sub1-kimia-1",
              deskripsi: "Gas ozon dan residu pembakaran isolasi kabel",
              risikoList: ["Inhalasi gas ozon dan gas pembakaran"],
              dampakList: ["Iritasi saluran napas akut"],
            },
          ],
        },
        hazardPhysics: "Tegangan tinggi 380V - 20kV, medan elektromagnetik kuat, panas busur api listrik",
        hazardChemical: "Gas ozon dan residu pembakaran isolasi kabel",
        hazardBiology: "-",
        hazardErgonomics: "Ruang kerja terbatas (confined narrow panel cubicle)",
        hazardPsychosocial: "Tekanan mental tinggi menghadapi pekerjaan bahaya fatal",
        riskImpact: "Sengatan listrik fatal (electrocution), luka bakar derajat 3 akibat arc flash, ledakan panel",

        controlDescriptions: [
          "Pintu panel listrik utama selalu terkunci",
          "Pemasangan sign peringatan bahaya tegangan tinggi",
          "Pemeriksaan visual rutin kabel dan sambungan setiap bulan",
        ],
        controlDescription: "Pintu panel terkunci dan tanda bahaya",
        selectedControls: ["Engineering Control", "Administrasi", "APD"],
        currentElimination: "-",
        currentSubstitution: "-",
        currentEngineering: "✓",
        currentAdministrative: "✓",
        currentApd: "✓",
        currentLikelihood: 4,
        currentSeverity: 5,
        currentNfr: 20,
        currentRiskLevel: "Sangat Tinggi",

        residualSelectedControls: ["Eliminasi", "Engineering Control", "Administrasi", "APD"],
        residualElimination: "✓",
        residualSubstitution: "-",
        residualEngineering: "✓",
        residualAdministrative: "✓",
        residualApd: "✓",
        residualLikelihood: 1,
        residualSeverity: 2,
        residualNfr: 2,
        residualRiskLevel: "Rendah",

        controlDuration: "7 Hari",
        controlStatus: "Close",
        responsiblePerson: "Siti Rahmawati (Tim K3)",
        targetDate: "2026-03-25",
      },
    ],

    hazard: "Arus listrik tegangan tinggi 380V - 20kV dan percikan busur api (arc flash)",
    risk: "Sengatan listrik fatal (electrocution), luka bakar derajat 3, kebakaran gedung",
    category: "Safety (S)",
    likelihood: 4,
    severity: 5,
    riskScore: 20,
    riskLevel: "extreme",
    existingControl: "Lockout/Tagout (LOTO) sederhana, APD standar safety shoes",
    additionalControl: "Wajib sertifikasi K3 Teknisi Listrik, LOTO ganda berstandar, pakaian anti arc flash 40 cal/cm2, sarung tangan dielektrik kelas 2, izin kerja berisiko tinggi (Permit to Work)",
    description: "Pemeriksaan dan penggantian MCB serta pembersihan busbar panel kubikel utama tahunan.",
    potentialImpact: "Kematian teknisi dan gangguan total operasional ANRI.",
    photos: [],
    status: "in_progress",
    statusHistory: [
      {
        status: "Draft",
        changedBy: "Siti Rahmawati",
        changedAt: "2026-03-01 08:00",
      },
      {
        status: "Approved",
        changedBy: "Dr. Budi Santoso",
        changedAt: "2026-03-02 10:00",
      },
    ],
    createdAt: "2026-03-01T08:00:00Z",
    updatedAt: "2026-03-02T10:00:00Z",
  },
  {
    id: 5,
    parentActivity: "Pengoperasian Komputer Meja Kerja Harian",
    activity: "Pengoperasian Komputer Meja Kerja Harian",
    unit: "Biro Umum dan Keuangan",
    location: "Ruang Kerja Staf Gedung A Lantai 1",
    activityType: "Rutin (R)",
    hazardClassification: ["Health (H)"],
    assessor: "Ahmad Fauzi (Tim K3)",
    assessmentDate: "2026-01-15",

    selectedHazardTypes: ["Fisika", "Ergonomi", "Psikososial"],
    hazardDetails: {
      Fisika: [
        {
          id: "komputer-fisika-1",
          deskripsi: "Pencahayaan silau dari layar komputer dan pantulan lampu ruangan",
          risikoList: ["Paparan radiasi sinar biru (blue light) dan kontras silau"],
          dampakList: ["Astenopia (mata lelah), mata kering, dan pusing kepala"],
        },
      ],
      Ergonomi: [
        {
          id: "komputer-ergonomi-1",
          deskripsi: "Duduk statis > 6 jam sehari, posisi leher menunduk, keyboard tidak sejajar siku",
          risikoList: ["Postur duduk membungkuk statis tanpa lumbar support"],
          dampakList: ["Forward head posture, Carpal Tunnel Syndrome (CTS), nyeri punggung bawah"],
        },
      ],
      Psikososial: [
        {
          id: "komputer-psikososial-1",
          deskripsi: "Target beban ketik harian tinggi berulang-ulang",
          risikoList: ["Monotoni pekerjaan dan tuntutan kecepatan entri data"],
          dampakList: ["Stres kerja ringan, kejenuhan mental"],
        },
      ],
    },

    hazardPhysics: "Pencahayaan silau dari layar komputer dan pantulan lampu ruangan",
    hazardChemical: "-",
    hazardBiology: "-",
    hazardErgonomics: "Duduk statis > 6 jam sehari, posisi leher menunduk, keyboard tidak setinggi siku",
    hazardPsychosocial: "Target beban ketik harian tinggi berulang-ulang",
    riskImpact: "Kelelahan mata (astenopia), Carpal Tunnel Syndrome (CTS), nyeri punggung bawah",

    controlDescriptions: [
      "Kursi kantor standar putar dengan sandaran punggung",
      "Penerapan jam istirahat makan siang reguler dan peregangan mata berkala",
      "Filter screen proteksi radiasi layar monitor komputer",
    ],
    controlDescription: "Kursi kantor standar putar dan jam istirahat makan siang reguler",
    selectedControls: ["Administrasi"],
    currentElimination: "-",
    currentSubstitution: "-",
    currentEngineering: "-",
    currentAdministrative: "✓",
    currentApd: "-",
    currentLikelihood: 2,
    currentSeverity: 2,
    currentNfr: 4,
    currentRiskLevel: "Sedang",

    residualSelectedControls: ["Engineering Control", "Administrasi", "APD"],
    residualElimination: "-",
    residualSubstitution: "-",
    residualEngineering: "✓",
    residualAdministrative: "✓",
    residualApd: "✓",
    residualLikelihood: 1,
    residualSeverity: 1,
    residualNfr: 1,
    residualRiskLevel: "Rendah",

    controlDuration: "30 Hari",
    controlStatus: "Close",
    responsiblePerson: "Ahmad Fauzi",
    targetDate: "2026-05-01",

    subActivities: [
      {
        id: "komputer-1",
        activity: "Pengetikan Dokumen dan Pengolahan Data di Workstation Komputer",
        location: "Ruang Kerja Staf Gedung A Lantai 1",
        activityType: "Rutin (R)",
        hazardClassification: ["Health (H)"],
        selectedHazardTypes: ["Fisika", "Ergonomi"],
        hazardRows: [
          {
            id: "menata-sub3-row-1",
            deskripsi: "Pintu brankas baja tebal dan berat dengan celah engsel sempit (pinch point)",
            jenisBahaya: ["Fisika"],
            risikoList: [
              "Jari tangan terjepit celah engsel pintu brankas baja",
              "Tertimpa daun pintu brankas saat menutup secara mendadak",
            ],
            dampakList: [
              "Memar tulang, luka robek, fraktur falang distal jari tangan",
            ],
            pengendalianList: [
              "Instruksi kerja penutupan manual brankas dengan memegang handle khusus (dilarang memegang kusen)",
              "Pemasangan sticker peringatan waspada titik jepit (pinch point danger) kuning-hitam",
              "Pemasangan peredam hidrolik / door stopper pada daun pintu brankas baja",
            ],
          },
          {
            id: "menata-sub3-row-2",
            deskripsi: "Mendorong daun pintu brankas berat dan mengangkat boks arsip ke rak brankas",
            jenisBahaya: ["Ergonomi"],
            risikoList: [
              "Gaya dorong berlebih pada sendi bahu dan siku",
              "Beban angkat kardus arsip berulang pada posisi ruang terbatas",
            ],
            dampakList: [
              "Ketegangan otot bahu (shoulder strain), spasme otot punggung",
            ],
            pengendalianList: [
              "Pelumasan rutin engsel dan gerendel pintu brankas setiap 3 bulan agar lancar didorong",
              "Penggunaan troli dorong mini untuk transfer boks arsip ke rak simpan",
              "Penetapan kapasitas maksimal boks simpan tidak melebihi 10 kg",
            ],
          },
        ],
        hazardDetails: {
          Fisika: [
            {
              id: "komputer-sub1-fisika-1",
              deskripsi: "Pencahayaan silau dari layar komputer dan pantulan lampu ruangan",
              risikoList: ["Mata lelah akibat paparan silau berkepanjangan"],
              dampakList: ["Astenopia dan sakit kepala"],
            },
          ],
          Ergonomi: [
            {
              id: "komputer-sub1-ergonomi-1",
              deskripsi: "Duduk statis > 6 jam sehari, posisi leher menunduk",
              risikoList: ["Ketegangan otot leher dan bahu"],
              dampakList: ["Nyeri punggung bawah (LBP) dan CTS"],
            },
          ],
        },
        hazardPhysics: "Pencahayaan silau layar monitor",
        hazardChemical: "-",
        hazardBiology: "-",
        hazardErgonomics: "Posisi duduk statis lama",
        hazardPsychosocial: "Target entri data harian",
        riskImpact: "Kelelahan mata (astenopia), nyeri leher dan punggung ringan",

        controlDescriptions: [
          "Kursi kantor putar standar dengan bantalan busa",
          "Istirahat makan siang teratur dan anjuran minum air putih cukup",
          "Pengaturan tingkat kecerahan layar monitor komputer kerja",
        ],
        controlDescription: "Kursi kantor biasa dan istirahat makan siang",
        selectedControls: ["Administrasi"],
        currentElimination: "-",
        currentSubstitution: "-",
        currentEngineering: "-",
        currentAdministrative: "✓",
        currentApd: "-",
        currentLikelihood: 2,
        currentSeverity: 2,
        currentNfr: 4,
        currentRiskLevel: "Sedang",

        residualSelectedControls: ["Engineering Control", "Administrasi", "APD"],
        residualElimination: "-",
        residualSubstitution: "-",
        residualEngineering: "✓",
        residualAdministrative: "✓",
        residualApd: "✓",
        residualLikelihood: 1,
        residualSeverity: 1,
        residualNfr: 1,
        residualRiskLevel: "Rendah",

        controlDuration: "30 Hari",
        controlStatus: "Close",
        responsiblePerson: "Ahmad Fauzi",
        targetDate: "2026-05-01",
      },
    ],

    hazard: "Posisi duduk statis lama dan pencahayaan layar monitor silau",
    risk: "Kelelahan mata (astenopia), nyeri leher dan punggung ringan",
    category: "Health (H)",
    likelihood: 2,
    severity: 2,
    riskScore: 4,
    riskLevel: "low",
    existingControl: "Kursi kantor standar putar",
    additionalControl: "Program peregangan/senam K3 setiap pukul 10.00 dan 14.00 (rule 20-20-20), penyesuaian ketinggian monitor sejajar mata",
    description: "Aktivitas pengetikan dan entry data arsip digital harian 8 jam kerja.",
    potentialImpact: "Penurunan konsentrasi dan kelelahan otot ringan.",
    photos: [],
    status: "resolved",
    statusHistory: [
      {
        status: "Draft",
        changedBy: "Ahmad Fauzi",
        changedAt: "2026-01-15 09:00",
      },
      {
        status: "Approved",
        changedBy: "Dr. Budi Santoso",
        changedAt: "2026-01-20 11:00",
      },
      {
        status: "Resolved",
        changedBy: "Siti Rahmawati",
        changedAt: "2026-02-15 15:00",
      },
    ],
    createdAt: "2026-01-15T09:00:00Z",
    updatedAt: "2026-02-15T15:00:00Z",
  },
];
