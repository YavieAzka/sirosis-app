import type { ImageSourcePropType } from 'react-native';

export interface TeamMember {
  id: string;
  name: string;
  initials: string;
  roleKey: string;
  institutionKey: string;
  photo: ImageSourcePropType;
  email?: string;
  emailSubject?: string;
}

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'serdiani',
    name: 'apt. Serdiani, S.Si, M.Farm',
    initials: 'SR',
    roleKey: 'about.roles.leadResearcher',
    institutionKey: 'about.institutions.farmasiUnand',
    photo: require('@/assets/images/team/serdiani.jpeg'),
    email: 'serdiani.farmasi1@gmail.com',
    emailSubject: 'Pertanyaan Riset: CirrhoSmart AI',
  },
  {
    id: 'promotor-1',
    name: 'Prof. apt. Fatma Sri Wahyuni, Ph.D',
    initials: 'FW',
    roleKey: 'about.roles.promoter',
    institutionKey: 'about.institutions.farmasiUnand',
    photo: require('@/assets/images/team/promotor-1.jpeg'),
  },
  {
    id: 'promotor-2',
    name: 'apt. Yelly Oktavia Sari, M.Pharm, Ph.D',
    initials: 'YO',
    roleKey: 'about.roles.coPromoter1',
    institutionKey: 'about.institutions.farmasiUnand',
    photo: require('@/assets/images/team/promotor-2.jpeg'),
  },
  {
    id: 'promotor-3',
    name: 'Dr. dr. Saptino Miro, Sp.PD, Subsp. G.E.H(K), FINASIM',
    initials: 'SM',
    roleKey: 'about.roles.coPromoter2',
    institutionKey: 'about.institutions.fkRsUpDjamil',
    photo: require('@/assets/images/team/promotor-3.jpeg'),
  },
  {
    id: 'promotor-4',
    name: 'Dr. apt. Hansen Nasif, S.Si, Sp. FRS',
    initials: 'HN',
    roleKey: 'about.roles.coPromoter3',
    institutionKey: 'about.institutions.farmasiUnand',
    photo: require('@/assets/images/team/promotor-4.jpeg'),
  },
  {
    id: 'yavie',
    name: 'Yavie Azka Putra Araly',
    initials: 'YA',
    roleKey: 'about.roles.aiEngineer',
    institutionKey: 'about.institutions.ifItb',
    photo: require('@/assets/images/team/yavie.jpg'),
    email: 'yavieazkaputra@gmail.com',
    emailSubject: 'Pertanyaan Teknis/AI: CirrhoSmart AI',
  },
];
