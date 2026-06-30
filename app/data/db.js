/* Sample data — mirrors go-chms-services API contracts. Bahasa Indonesia. */
export const DB = (function () {

  const households = [
    { id: 1, household_name: 'Keluarga Sitorus', address: 'Jl. Merdeka No. 45, Jakarta Pusat', members: [
      { id: 1, household_role: 'Kepala Keluarga', full_name: 'Jonathan Sitorus', gender: 'Laki-laki', birth_date: '1985-05-14', phone_number: '+62 812-3456-780', baptism_status: 'Dewasa', marriage_status: 'Kawin', membership_status: 'Jemaat Tetap', user_id: 22 },
      { id: 2, household_role: 'Istri', full_name: 'Mariana Sitorus', gender: 'Perempuan', birth_date: '1987-09-02', phone_number: '+62 812-9087-114', baptism_status: 'Dewasa', marriage_status: 'Kawin', membership_status: 'Jemaat Tetap' },
      { id: 3, household_role: 'Anak', full_name: 'Gabriel Sitorus', gender: 'Laki-laki', birth_date: '2012-01-20', phone_number: null, baptism_status: 'Anak', marriage_status: 'Belum Kawin', membership_status: 'Jemaat Tetap' },
      { id: 4, household_role: 'Anak', full_name: 'Keisha Sitorus', gender: 'Perempuan', birth_date: '2016-07-08', phone_number: null, baptism_status: 'Belum', marriage_status: 'Belum Kawin', membership_status: 'Jemaat Tetap' },
    ]},
    { id: 2, household_name: 'Keluarga Tampubolon', address: 'Jl. Anggrek Raya No. 12, Bekasi', members: [
      { id: 5, household_role: 'Kepala Keluarga', full_name: 'Daniel Tampubolon', gender: 'Laki-laki', birth_date: '1979-11-30', phone_number: '+62 813-7700-221', baptism_status: 'Dewasa', marriage_status: 'Kawin', membership_status: 'Jemaat Tetap' },
      { id: 6, household_role: 'Istri', full_name: 'Ruth Tampubolon', gender: 'Perempuan', birth_date: '1982-04-17', phone_number: '+62 813-2211-090', baptism_status: 'Dewasa', marriage_status: 'Kawin', membership_status: 'Jemaat Tetap' },
      { id: 7, household_role: 'Orang Tua', full_name: 'Bernard Tampubolon', gender: 'Laki-laki', birth_date: '1951-03-09', phone_number: null, baptism_status: 'Dewasa', marriage_status: 'Cerai Mati', membership_status: 'Jemaat Tetap' },
    ]},
    { id: 3, household_name: 'Keluarga Wijaya', address: 'Apartemen Green Lake Tower B/18, Jakarta Barat', members: [
      { id: 8, household_role: 'Kepala Keluarga', full_name: 'Steven Wijaya', gender: 'Laki-laki', birth_date: '1990-08-25', phone_number: '+62 811-4523-668', baptism_status: 'Dewasa', marriage_status: 'Kawin', membership_status: 'Jemaat Tetap' },
      { id: 9, household_role: 'Istri', full_name: 'Felicia Wijaya', gender: 'Perempuan', birth_date: '1992-12-11', phone_number: '+62 811-3389-447', baptism_status: 'Dewasa', marriage_status: 'Kawin', membership_status: 'Jemaat Tetap' },
    ]},
    { id: 4, household_name: 'Keluarga Manurung', address: 'Jl. Cendana No. 8, Tangerang Selatan', members: [
      { id: 10, household_role: 'Kepala Keluarga', full_name: 'Albert Manurung', gender: 'Laki-laki', birth_date: '1975-06-19', phone_number: '+62 877-1290-553', baptism_status: 'Dewasa', marriage_status: 'Kawin', membership_status: 'Jemaat Tetap' },
      { id: 11, household_role: 'Istri', full_name: 'Yohana Manurung', gender: 'Perempuan', birth_date: '1978-02-28', phone_number: null, baptism_status: 'Dewasa', marriage_status: 'Kawin', membership_status: 'Jemaat Tetap' },
      { id: 12, household_role: 'Anak', full_name: 'Michael Manurung', gender: 'Laki-laki', birth_date: '2003-10-05', phone_number: '+62 896-5512-007', baptism_status: 'Dewasa', marriage_status: 'Belum Kawin', membership_status: 'Jemaat Tetap' },
    ]},
    { id: 5, household_name: 'Keluarga Halim', address: 'Jl. Pluit Karang No. 3, Jakarta Utara', members: [
      { id: 13, household_role: 'Kepala Keluarga', full_name: 'Kevin Halim', gender: 'Laki-laki', birth_date: '1995-03-12', phone_number: '+62 818-9001-233', baptism_status: 'Dewasa', marriage_status: 'Belum Kawin', membership_status: 'Simpatisan' },
    ]},
    { id: 6, household_name: 'Keluarga Nainggolan', address: 'Jl. Kenanga No. 27, Depok', members: [
      { id: 14, household_role: 'Kepala Keluarga', full_name: 'Roganda Nainggolan', gender: 'Laki-laki', birth_date: '1968-07-22', phone_number: '+62 821-6677-810', baptism_status: 'Dewasa', marriage_status: 'Kawin', membership_status: 'Jemaat Tetap' },
      { id: 15, household_role: 'Istri', full_name: 'Tiur Nainggolan', gender: 'Perempuan', birth_date: '1970-11-04', phone_number: null, baptism_status: 'Dewasa', marriage_status: 'Kawin', membership_status: 'Jemaat Tetap' },
      { id: 16, household_role: 'Anak', full_name: 'Grace Nainggolan', gender: 'Perempuan', birth_date: '1999-05-18', phone_number: '+62 856-2211-934', baptism_status: 'Dewasa', marriage_status: 'Belum Kawin', membership_status: 'Pindah' },
    ]},
    { id: 7, household_name: 'Keluarga Pasaribu', address: 'Jl. Flamboyan No. 19, Jakarta Selatan', members: [
      { id: 17, household_role: 'Kepala Keluarga', full_name: 'Hendrik Pasaribu', gender: 'Laki-laki', birth_date: '1983-09-27', phone_number: '+62 812-5567-019', baptism_status: 'Dewasa', marriage_status: 'Kawin', membership_status: 'Jemaat Tetap' },
      { id: 18, household_role: 'Istri', full_name: 'Debora Pasaribu', gender: 'Perempuan', birth_date: '1986-01-14', phone_number: '+62 812-8890-441', baptism_status: 'Dewasa', marriage_status: 'Kawin', membership_status: 'Jemaat Tetap' },
    ]},
  ];

  const announcements = [
    { id: 12, title: 'Ibadah Padang Pemuda 2026', content: '<p>Diberitahukan kepada seluruh pemuda jemaat bahwa Ibadah Padang akan diselenggarakan di Bumi Perkemahan Cibubur. Pendaftaran dibuka hingga 20 Juni 2026.</p>', category: 'Youth', status: 'Published', publish_date: '2026-06-15', expiry_date: '2026-06-22', author_id: 4, is_notification_triggered: true, notification_channels: { whatsapp: 'pending_integration', push_notification: 'pending_integration' } },
    { id: 11, title: 'Pelayanan Sakramen Perjamuan Kudus — Juni', content: '<p>Sakramen Perjamuan Kudus akan dilayankan pada Ibadah Umum Raya I & II Minggu, 21 Juni 2026. Jemaat dimohon mempersiapkan diri.</p>', category: 'Ministry', status: 'Published', publish_date: '2026-06-14', expiry_date: '2026-06-21', author_id: 2, is_notification_triggered: false, notification_channels: {} },
    { id: 10, title: 'Bakti Sosial & Donor Darah Komisi Diakonia', content: '<p>Komisi Diakonia mengundang jemaat dalam kegiatan donor darah bekerja sama dengan PMI, di Gedung Serbaguna lantai 2.</p>', category: 'Social', status: 'Published', publish_date: '2026-06-10', expiry_date: '2026-06-28', author_id: 4, is_notification_triggered: true, notification_channels: { whatsapp: 'pending_integration' } },
    { id: 9, title: 'Penerimaan Guru Sekolah Minggu Baru', content: '<p>Dibuka kesempatan melayani sebagai guru Sekolah Minggu untuk Semester II 2026. Hubungi sekretariat.</p>', category: 'Sunday School', status: 'Draft', publish_date: '2026-06-18', expiry_date: '2026-07-18', author_id: 2, is_notification_triggered: false, notification_channels: {} },
    { id: 8, title: 'Jadwal Ibadah Khusus HUT Jemaat ke-37', content: '<p>Rangkaian perayaan HUT Jemaat ke-37 akan dimulai dengan ibadah syukur pada 5 Juli 2026 pukul 09.00 WIB.</p>', category: 'General', status: 'Published', publish_date: '2026-06-08', expiry_date: '2026-07-05', author_id: 1, is_notification_triggered: true, notification_channels: { whatsapp: 'pending_integration', push_notification: 'pending_integration' } },
    { id: 7, title: 'Persembahan Pembangunan Gedung Pastori', content: '<p>Update progres pembangunan pastori telah mencapai 64%. Terima kasih atas dukungan persembahan jemaat.</p>', category: 'General', status: 'Archived', publish_date: '2026-05-01', expiry_date: '2026-05-31', author_id: 1, is_notification_triggered: true, notification_channels: { whatsapp: 'pending_integration' } },
    { id: 6, title: 'Latihan Gabungan Paduan Suara Natal', content: '<p>Seluruh anggota PS dimohon hadir latihan gabungan persiapan pelayanan akhir tahun. Setiap Jumat pukul 19.00.</p>', category: 'Ministry', status: 'Draft', publish_date: '2026-06-20', expiry_date: '2026-08-30', author_id: 2, is_notification_triggered: false, notification_channels: {} },
  ];

  // Staff / author directory (author_name resolution for warta)
  const staff = {
    1: 'Pdt. Samuel Limbong', 2: 'Rina Hutapea', 4: 'Aditya Pratama', 15: 'Aditya Pratama',
  };

  // ---- File Storage (UUID metadata records) ----
  const files = [
    { file_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6', original_name: 'Formulir-Pendaftaran-Padang-2026.pdf', mime_type: 'application/pdf', size_bytes: 248320, uploaded_by: 4, created_at: '2026-06-14T08:00:00Z' },
    { file_id: 'b7e2c1a0-9f33-4d12-8b41-1c0a7e55d901', original_name: 'Poster-Ibadah-Padang-Pemuda.png', mime_type: 'image/png', size_bytes: 1843200, uploaded_by: 4, created_at: '2026-06-14T08:02:00Z' },
    { file_id: 'c91f4d8e-2a7b-49c6-bb10-77e3f0a2b4d5', original_name: 'Tata-Ibadah-Perjamuan-Kudus.pdf', mime_type: 'application/pdf', size_bytes: 96100, uploaded_by: 2, created_at: '2026-06-13T10:15:00Z' },
    { file_id: 'd0a8b3f1-6c54-4e29-9a77-2b6d8e1f0c33', original_name: 'Denah-Lokasi-Bumi-Perkemahan.jpg', mime_type: 'image/jpeg', size_bytes: 612400, uploaded_by: 4, created_at: '2026-06-14T08:05:00Z' },
    { file_id: 'e5c7d942-8b16-4f0a-a3d1-9f4e2c6b7a08', original_name: 'Brosur-Donor-Darah-Diakonia.pdf', mime_type: 'application/pdf', size_bytes: 154700, uploaded_by: 4, created_at: '2026-06-10T09:30:00Z' },
  ];

  // ---- RBAC: system user accounts ----
  const users = [
    { user_id: 15, full_name: 'Aditya Pratama', email: 'bendahara@gereja.org', is_active: true, roles: ['Bendahara'] },
    { user_id: 4, full_name: 'Rina Hutapea', email: 'sekretariat@gereja.org', is_active: true, roles: ['Sekretariat'] },
    { user_id: 1, full_name: 'Pdt. Samuel Limbong', email: 'gembala@gereja.org', is_active: true, roles: ['Administrator'] },
    { user_id: 7, full_name: 'Yosef Tanjung', email: 'media@gereja.org', is_active: true, roles: ['Multimedia'] },
    { user_id: 9, full_name: 'Priska Wijonarko', email: 'soundman@gereja.org', is_active: true, roles: ['Soundman'] },
    { user_id: 12, full_name: 'Daud Simanjuntak', email: 'worship@gereja.org', is_active: true, roles: ['Worship Leader'] },
    { user_id: 18, full_name: 'Hana Pardede', email: 'diakonia@gereja.org', is_active: true, roles: ['Diaken'] },
    { user_id: 21, full_name: 'Markus Siahaan', email: 'majelis1@gereja.org', is_active: true, roles: ['Majelis'] },
    { user_id: 24, full_name: 'Elisabet Naibaho', email: 'majelis2@gereja.org', is_active: false, roles: ['Majelis'] },
    { user_id: 27, full_name: 'Timotius Gultom', email: 'liturgis@gereja.org', is_active: true, roles: ['Liturgist'] },
  ];

  // ---- RBAC: roles ----
  const roles = [
    { id: 1, name: 'Administrator', description: 'Akses penuh — Super Admin sistem.' },
    { id: 2, name: 'Bendahara', description: 'Pengelola ledger kas & penutupan periode.' },
    { id: 3, name: 'Sekretariat', description: 'Pengelola data jemaat & warta.' },
    { id: 4, name: 'Worship Leader', description: 'Pemimpin pujian & penyusun liturgi.' },
    { id: 5, name: 'Multimedia', description: 'Operator tayangan & konten visual.' },
    { id: 6, name: 'Majelis', description: 'Penatua/penilik jemaat.' },
    { id: 7, name: 'Diaken', description: 'Pelayanan diakonia & sosial.' },
  ];

  // ---- RBAC: modules & submodules (is_view = read-only) ----
  const modules = [
    { id: 1, code: 'FINANCE', name: 'Keuangan', description: 'Ledger kas & periode anggaran', sort_order: 1, is_active: true, submodules: [
      { id: 11, code: 'FINANCE_TRANSACTION_VIEW', name: 'Lihat Transaksi', sort_order: 1, is_active: true, is_view: true },
      { id: 12, code: 'FINANCE_TRANSACTION_CREATE', name: 'Catat Transaksi', sort_order: 2, is_active: true, is_view: false },
      { id: 13, code: 'FINANCE_PERIOD_CLOSE', name: 'Tutup Periode (2FA)', sort_order: 3, is_active: true, is_view: false },
    ]},
    { id: 2, code: 'ORGANIZATION', name: 'Jemaat', description: 'Rumah tangga & keanggotaan', sort_order: 2, is_active: true, submodules: [
      { id: 21, code: 'ORG_HOUSEHOLD_VIEW', name: 'Lihat Rumah Tangga', sort_order: 1, is_active: true, is_view: true },
      { id: 22, code: 'ORG_HOUSEHOLD_CREATE', name: 'Daftarkan Rumah Tangga', sort_order: 2, is_active: true, is_view: false },
      { id: 23, code: 'ORG_MEMBER_MANAGE', name: 'Kelola Anggota', sort_order: 3, is_active: true, is_view: false },
    ]},
    { id: 3, code: 'ANNOUNCEMENT', name: 'Warta', description: 'Pengumuman & publikasi', sort_order: 3, is_active: true, submodules: [
      { id: 31, code: 'ANN_VIEW', name: 'Lihat Warta', sort_order: 1, is_active: true, is_view: true },
      { id: 32, code: 'ANN_CREATE', name: 'Tulis & Ubah Warta', sort_order: 2, is_active: true, is_view: false },
      { id: 33, code: 'ANN_PUBLISH', name: 'Publikasi & Arsip', sort_order: 3, is_active: true, is_view: false },
      { id: 34, code: 'ANN_DELETE', name: 'Hapus Warta', sort_order: 4, is_active: true, is_view: false },
    ]},
    { id: 4, code: 'RITE', name: 'Ibadah & Liturgi', description: 'Susunan acara & template', sort_order: 4, is_active: true, submodules: [
      { id: 41, code: 'RITE_OOS_VIEW', name: 'Lihat Susunan Acara', sort_order: 1, is_active: true, is_view: true },
      { id: 42, code: 'RITE_OOS_MANAGE', name: 'Kelola Linimasa', sort_order: 2, is_active: true, is_view: false },
    ]},
    { id: 5, code: 'RBAC', name: 'Kontrol Akses', description: 'Grup, peran & izin', sort_order: 5, is_active: true, submodules: [
      { id: 51, code: 'RBAC_GROUP_VIEW', name: 'Lihat Grup', sort_order: 1, is_active: true, is_view: true },
      { id: 52, code: 'RBAC_GROUP_MANAGE', name: 'Kelola Grup & Anggota', sort_order: 2, is_active: true, is_view: false },
      { id: 53, code: 'RBAC_PERMISSION_MANAGE', name: 'Atur Izin Submodul', sort_order: 3, is_active: true, is_view: false },
    ]},
  ];

  // SubmoduleSummary.description (nullable) per frontend-api-guide §9
  const SUBMODULE_DESC = {
    FINANCE_TRANSACTION_VIEW: 'Akses baca ledger kas & mutasi transaksi.',
    FINANCE_TRANSACTION_CREATE: 'Mencatat entri transaksi baru (append-only).',
    FINANCE_PERIOD_CLOSE: 'Menutup periode keuangan dengan verifikasi 2FA.',
    ORG_HOUSEHOLD_VIEW: 'Melihat daftar & detail rumah tangga.',
    ORG_HOUSEHOLD_CREATE: 'Mendaftarkan rumah tangga & jemaat utama.',
    ORG_MEMBER_MANAGE: 'Menambah & mengelola anggota keluarga.',
    ANN_VIEW: 'Melihat seluruh warta termasuk draf.',
    ANN_CREATE: 'Menulis & menyunting warta.',
    ANN_PUBLISH: 'Mengubah status publikasi & arsip warta.',
    ANN_DELETE: 'Menghapus warta secara permanen.',
    RITE_OOS_VIEW: 'Melihat susunan acara ibadah.',
    RITE_OOS_MANAGE: 'Mengelola linimasa mata acara.',
    RBAC_GROUP_VIEW: 'Melihat grup & komposisinya.',
    RBAC_GROUP_MANAGE: 'Mengelola grup, peran & anggota.',
    RBAC_PERMISSION_MANAGE: 'Mengatur izin per submodul.',
  };
  modules.forEach(m => m.submodules.forEach(s => { s.description = SUBMODULE_DESC[s.code] || null; }));

  // ---- RBAC: groups (with roles + members) ----
  const groups = [
    { id: 1, name: 'Tim Keuangan', description: 'Bendahara & verifikator buku kas gereja.', is_active: true, created_at: '2026-01-08T00:00:00Z', updated_at: '2026-06-01T00:00:00Z',
      role_ids: [2], member_ids: [15, 1], granted: [11, 12, 13, 21, 31] },
    { id: 2, name: 'Sekretariat & Warta', description: 'Pengelola data jemaat dan publikasi warta.', is_active: true, created_at: '2026-01-08T00:00:00Z', updated_at: '2026-05-22T00:00:00Z',
      role_ids: [3], member_ids: [4], granted: [21, 22, 23, 31, 32, 33, 34, 41] },
    { id: 3, name: 'Tim Multimedia & Sound', description: 'Operator tayangan, audio, dan kontrol ruang ibadah.', is_active: true, created_at: '2026-02-14T00:00:00Z', updated_at: '2026-06-09T00:00:00Z',
      role_ids: [5, 4], member_ids: [7, 9, 12], granted: [41, 42, 31] },
    { id: 4, name: 'Majelis Jemaat', description: 'Penatua & penilik — akses pemantauan menyeluruh.', is_active: true, created_at: '2026-01-08T00:00:00Z', updated_at: '2026-04-30T00:00:00Z',
      role_ids: [6, 7], member_ids: [21, 24, 18], granted: [11, 21, 31, 41] },
    { id: 5, name: 'Super Admin', description: 'Administrator sistem dengan kontrol penuh RBAC.', is_active: true, created_at: '2026-01-01T00:00:00Z', updated_at: '2026-06-12T00:00:00Z',
      role_ids: [1], member_ids: [1], granted: [11, 12, 13, 21, 22, 23, 31, 32, 33, 34, 41, 42, 51, 52, 53] },
    { id: 6, name: 'Komisi Pemuda', description: 'Grup non-aktif — menunggu penugasan peran.', is_active: false, created_at: '2026-03-20T00:00:00Z', updated_at: '2026-03-20T00:00:00Z',
      role_ids: [], member_ids: [], granted: [31] },
  ];

  // Newer warta exercising the expanded category set
  announcements.push(
    { id: 13, title: 'Pemberkatan Nikah — Kevin Halim & Felicia Tanuwijaya', content: '<p>Mengundang jemaat menghadiri ibadah pemberkatan pernikahan kudus, Sabtu 27 Juni 2026 pukul 10.00 WIB di gedung induk.</p>', category: 'Wedding', status: 'Published', publish_date: '2026-06-13', expiry_date: '2026-06-27', author_id: 4, is_notification_triggered: false, notification_channels: {} },
    { id: 14, title: 'Pelayanan Baptisan Kudus Anak — Juli', content: '<p>Pendaftaran baptisan anak untuk periode Juli 2026 dibuka di sekretariat hingga 30 Juni. Sertakan akta kelahiran.</p>', category: 'Baptism', status: 'Published', publish_date: '2026-06-12', expiry_date: '2026-06-30', author_id: 2, is_notification_triggered: false, notification_channels: {} },
    { id: 15, title: 'Berita Dukacita — Kel. Bernard Tampubolon', content: '<p>Telah berpulang ke rumah Bapa, Opung Bernard Tampubolon (75 thn). Ibadah penghiburan diadakan setiap malam pukul 19.00.</p>', category: 'Bereavement', status: 'Published', publish_date: '2026-06-14', expiry_date: '2026-06-18', author_id: 1, is_notification_triggered: true, notification_channels: { whatsapp: 'pending_integration' } },
    { id: 16, title: 'Laporan Keuangan Triwulan II 2026', content: '<p>Ringkasan laporan keuangan jemaat triwulan II telah tersedia. Jemaat dapat meminta salinan di sekretariat.</p>', category: 'Finance', status: 'Draft', publish_date: '2026-06-20', expiry_date: '2026-07-20', author_id: 15, is_notification_triggered: false, notification_channels: {} },
    { id: 17, title: 'Rantai Doa 24 Jam Jelang HUT Jemaat', content: '<p>Mari ambil bagian dalam rantai doa 24 jam. Daftarkan slot waktu Anda melalui komisi doa.</p>', category: 'Prayer', status: 'Published', publish_date: '2026-06-11', expiry_date: '2026-07-04', author_id: 2, is_notification_triggered: false, notification_channels: {} },
  );

  // Enrich every announcement with the fields added in the updated API guide
  const annAttach = {
    12: ['3fa85f64-5717-4562-b3fc-2c963f66afa6', 'b7e2c1a0-9f33-4d12-8b41-1c0a7e55d901', 'd0a8b3f1-6c54-4e29-9a77-2b6d8e1f0c33'],
    11: ['c91f4d8e-2a7b-49c6-bb10-77e3f0a2b4d5'],
    10: ['e5c7d942-8b16-4f0a-a3d1-9f4e2c6b7a08'],
  };
  const annPinned = { 12: true, 15: true };
  announcements.forEach(a => {
    a.author_name = staff[a.author_id] || null;
    a.is_pinned = !!annPinned[a.id];
    a.attachment_ids = annAttach[a.id] || [];
    a.created_at = a.publish_date + 'T07:30:00Z';
    a.updated_at = a.publish_date + 'T07:30:00Z';
  });

  // Member.household_id per frontend-api-guide §4 (Member object)
  households.forEach(h => h.members.forEach(m => { m.household_id = h.id; }));

  const oos = {
    service_id: 10, title: 'Ibadah Umum Raya I', service_date: '2026-06-14T08:00:00Z',
    order_of_service: [
      { id: 41, sequence_order: 1, duration_minutes: 5, activity_name: 'Persiapan & Saat Teduh', pic_role: 'Multimedia', song_id: null, description: 'Tayangan ayat sambutan + instrumental.' },
      { id: 42, sequence_order: 2, duration_minutes: 8, activity_name: 'Votum, Salam & Introitus', pic_role: 'Liturgist', song_id: null, description: 'Liturgis membuka ibadah.' },
      { id: 47, sequence_order: 3, duration_minutes: 12, activity_name: 'Pujian Pembuka (3 Lagu)', pic_role: 'Worship Leader', song_id: 88, description: 'KJ 17, NKB 3, dan lagu tema.' },
      { id: 43, sequence_order: 4, duration_minutes: 15, activity_name: 'Ritus Sakramen Perjamuan Kudus', pic_role: 'Liturgist', song_id: null, description: 'Menggunakan template Liturgi Perjamuan Kudus Baku.' },
      { id: 44, sequence_order: 5, duration_minutes: 30, activity_name: 'Khotbah — Pdt. Samuel Limbong', pic_role: 'Soundman', song_id: null, description: 'Mic lavalier 2 aktif. Tema: "Anugerah yang Memulihkan".' },
      { id: 45, sequence_order: 6, duration_minutes: 7, activity_name: 'Persembahan Syukur', pic_role: 'Multimedia', song_id: 105, description: 'Tayangkan QRIS + nomor rekening.' },
      { id: 46, sequence_order: 7, duration_minutes: 6, activity_name: 'Doa Syafaat & Pengutusan', pic_role: 'Worship Leader', song_id: 92, description: 'Berkat oleh Pendeta.' },
    ],
  };

  const liturgy_templates = [
    { id: 1, name: 'Perjamuan Kudus', rite_type: 'Sacrament', standard_guide: 'Panduan baku pelayanan Sakramen Perjamuan Kudus: pembacaan institusi, pemecahan roti, pembagian cawan, dan doa syukur agung.' },
    { id: 2, name: 'Baptisan Kudus Dewasa', rite_type: 'Sacrament', standard_guide: 'Tata cara baptisan dewasa: pengakuan iman, pertanyaan baptisan, pelayanan air baptisan, dan peneguhan.' },
    { id: 3, name: 'Baptisan Anak', rite_type: 'Sacrament', standard_guide: 'Tata cara baptisan anak dengan janji orang tua dan jemaat.' },
    { id: 4, name: 'Ibadah Minggu Reguler', rite_type: 'Regular Service', standard_guide: 'Liturgi ibadah Minggu standar: votum-salam, pujian, pengakuan dosa, pemberitaan firman, dan pengutusan.' },
    { id: 5, name: 'Ibadah Natal', rite_type: 'Special Event', standard_guide: 'Tata ibadah perayaan Natal dengan prosesi lilin dan liturgi khusus kelahiran Kristus.' },
    { id: 6, name: 'Peneguhan & Pemberkatan Nikah', rite_type: 'Special Event', standard_guide: 'Tata ibadah pemberkatan pernikahan kudus: janji nikah, pemberkatan, dan penyematan cincin.' },
  ];

  const budget_posts = [
    { id: 1, name: 'Operasional Umum' }, { id: 2, name: 'Persembahan Persepuluhan' },
    { id: 3, name: 'Diakonia & Sosial' }, { id: 4, name: 'Pembangunan Pastori' },
    { id: 5, name: 'Komisi Pemuda' }, { id: 6, name: 'Musik & Multimedia' },
  ];

  const period = { id: 4, code: 'PER-CHMS-JUNI-2026', type: 'Monthly', status: 'Open', start_date: '2026-06-01', end_date: '2026-06-30', beginning_balance: 118400000, ending_balance: 142500000 };

  const transactions = [
    { transaction_id: 7891204, reference_code: 'TX-MNDR-20260612-09412', period_id: 4, budget_post_id: 2, transaction_type: 'Debit', amount: 7500000, description: 'Penerimaan persembahan persepuluhan via QRIS Bank Mandiri', record_status: 'COMMITTED_IMMUTABLE', timestamp: '2026-06-12T23:10:00Z' },
    { transaction_id: 7891198, reference_code: 'TX-TRF-20260612-08820', period_id: 4, budget_post_id: 1, transaction_type: 'Credit', amount: 2350000, description: 'Alokasi pembayaran listrik & air gedung gereja', record_status: 'COMMITTED_IMMUTABLE', timestamp: '2026-06-12T14:02:00Z' },
    { transaction_id: 7891182, reference_code: 'TX-TUNAI-20260611-07719', period_id: 4, budget_post_id: 3, transaction_type: 'Debit', amount: 4100000, description: 'Penerimaan persembahan diakonia tunai Ibadah Raya II', record_status: 'COMMITTED_IMMUTABLE', timestamp: '2026-06-11T11:40:00Z' },
    { transaction_id: 7891170, reference_code: 'TX-TRF-20260610-06530', period_id: 4, budget_post_id: 4, transaction_type: 'Credit', amount: 18750000, description: 'Alokasi termin III kontraktor pembangunan pastori', record_status: 'COMMITTED_IMMUTABLE', timestamp: '2026-06-10T09:25:00Z' },
    { transaction_id: 7891155, reference_code: 'TX-QRIS-20260609-05402', period_id: 4, budget_post_id: 2, transaction_type: 'Debit', amount: 12300000, description: 'Penerimaan persembahan persepuluhan via QRIS Bank BCA', record_status: 'COMMITTED_IMMUTABLE', timestamp: '2026-06-09T20:15:00Z' },
    { transaction_id: 7891140, reference_code: 'TX-TRF-20260608-04111', period_id: 4, budget_post_id: 6, transaction_type: 'Credit', amount: 3600000, description: 'Alokasi pembelian kabel & sewa lighting multimedia', record_status: 'COMMITTED_IMMUTABLE', timestamp: '2026-06-08T16:50:00Z' },
    { transaction_id: 7891132, reference_code: 'TX-TUNAI-20260608-03980', period_id: 4, budget_post_id: 5, transaction_type: 'Debit', amount: 2750000, description: 'Penerimaan iuran kegiatan retreat Komisi Pemuda tunai', record_status: 'COMMITTED_IMMUTABLE', timestamp: '2026-06-08T10:05:00Z' },
    { transaction_id: 7891120, reference_code: 'TX-TRF-20260607-02877', period_id: 4, budget_post_id: 1, transaction_type: 'Credit', amount: 5200000, description: 'Alokasi honor pendeta tamu & transport pelayan mimbar', record_status: 'COMMITTED_IMMUTABLE', timestamp: '2026-06-07T13:30:00Z' },
    { transaction_id: 7891108, reference_code: 'TX-QRIS-20260606-01640', period_id: 4, budget_post_id: 2, transaction_type: 'Debit', amount: 9850000, description: 'Penerimaan persembahan persepuluhan via QRIS GoPay', record_status: 'COMMITTED_IMMUTABLE', timestamp: '2026-06-06T19:45:00Z' },
  ];

  const dependencies = { postgres: 'ok', mongodb: 'ok', redis: 'ok' };

  // Helpers
  const fmtIDR = (n) => 'Rp ' + Math.round(n).toLocaleString('id-ID');
  const fmtIDRk = (n) => { if (n >= 1e9) return 'Rp ' + (n/1e9).toFixed(1).replace('.',',') + ' M'; if (n >= 1e6) return 'Rp ' + (n/1e6).toFixed(1).replace('.',',') + ' jt'; return 'Rp ' + n.toLocaleString('id-ID'); };
  const age = (d) => { const t = new Date('2026-06-15'); const b = new Date(d); let a = t.getFullYear()-b.getFullYear(); if (t.getMonth()<b.getMonth()||(t.getMonth()===b.getMonth()&&t.getDate()<b.getDate())) a--; return a; };
  const initials = (name) => name.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase();
  const idDate = (s) => { const m=['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des']; const d=new Date(s); return d.getDate()+' '+m[d.getMonth()]+' '+d.getFullYear(); };
  const idDateTime = (s) => { const d=new Date(s); return idDate(s)+' • '+String(d.getUTCHours()).padStart(2,'0')+':'+String(d.getUTCMinutes()).padStart(2,'0'); };
  const fmtBytes = (b) => { if (b >= 1048576) return (b/1048576).toFixed(1).replace('.',',') + ' MB'; if (b >= 1024) return Math.round(b/1024) + ' KB'; return b + ' B'; };
  const fileById = (id) => files.find(f => f.file_id === id);

  const totalMembers = households.reduce((a,h)=>a+h.members.length,0);
  const totalDebit = transactions.filter(t=>t.transaction_type==='Debit').reduce((a,t)=>a+t.amount,0);
  const totalCredit = transactions.filter(t=>t.transaction_type==='Credit').reduce((a,t)=>a+t.amount,0);

  return { households, announcements, oos, liturgy_templates, budget_posts, period, transactions, dependencies,
    files, users, roles, modules, groups, staff,
    fmtIDR, fmtIDRk, age, initials, idDate, idDateTime, fmtBytes, fileById, totalMembers, totalDebit, totalCredit,
    user: { id: 15, full_name: 'Aditya Pratama', email: 'bendahara@gereja.org', roles: ['Bendahara'], phone_number: '+62 812-3456-7890' } };
})();
