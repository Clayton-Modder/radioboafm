
import { Program } from './types';

export const RADIO_STREAM_URL = 'https://cast.radiu.live:9601/stream?1767910790579';
export const TV_STREAM_URL = 'https://a.cdni.live/boafmirece/boafmirece/chunklist_w1535480119.m3u8';

export const MODELS = {
  FAST: 'gemini-3-flash-preview',
  THINKING: 'gemini-3-pro-preview',
  IMAGE: 'gemini-2.5-flash-image',
  MAPS: 'gemini-2.5-flash'
};

export interface Host {
  id: string;
  name: string;
  avatar: string;
}

export const HOSTS: Host[] = [
  { id: 'h1', name: 'Rivamar Mesquita', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150' },
  { id: 'h2', name: 'Cláudio Roseno', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150' },
  { id: 'h3', name: 'Jaqueline Mendes', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150' },
  { id: 'h4', name: 'Ney Moreno', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150' },
  { id: 'h5', name: 'Bebeto Oliveira', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150' },
  { id: 'h6', name: 'Luanne Trotta', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150' }
];

export const SCHEDULE: Program[] = [
  {
    id: '1',
    name: 'Madrugada Boa',
    host: 'Equipe Boa FM',
    startTime: '00:05',
    endTime: '05:00',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=400',
    description: 'A trilha sonora ideal para as suas madrugadas.'
  },
  {
    id: '2',
    name: 'Rancho da Boa',
    host: 'Rivamar Mesquita',
    startTime: '05:00',
    endTime: '07:00',
    image: 'https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?auto=format&fit=crop&q=80&w=400',
    description: 'O melhor do sertanejo e da vida no campo para começar o dia.'
  },
  {
    id: '3',
    name: 'Poder da Noticia',
    host: 'Jornalismo Boa FM',
    startTime: '07:00',
    endTime: '08:30',
    image: 'https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&q=80&w=400',
    description: 'Informação com credibilidade e rapidez logo cedo.'
  },
  {
    id: '4',
    name: 'Bom dia, Boa!',
    host: 'Cláudio Roseno',
    startTime: '08:30',
    endTime: '11:00',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=400',
    description: 'Música, alegria e prêmios nas suas manhãs.'
  },
  {
    id: '5',
    name: 'WhatsApp Boa - 1° Edição',
    host: 'Cláudio Roseno',
    startTime: '11:00',
    endTime: '12:00',
    image: 'https://images.unsplash.com/photo-1577563908411-5077b6dc7624?auto=format&fit=crop&q=80&w=400',
    description: 'A participação do ouvinte através das nossas redes sociais.'
  },
  {
    id: '6',
    name: 'Impacto da Noticia',
    host: 'Jaqueline Mendes',
    startTime: '12:00',
    endTime: '13:00',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400',
    description: 'As notícias que impactam o seu dia a dia em Irecê e região.'
  },
  {
    id: '7',
    name: 'WhatsApp Boa - 2° Edição',
    host: 'Ney Moreno',
    startTime: '13:00',
    endTime: '14:00',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=400',
    description: 'A hora do ouvinte com muita música e interação.'
  },
  {
    id: '8',
    name: 'Super Tarde',
    host: 'Bebeto Oliveira',
    startTime: '14:00',
    endTime: '17:00',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=400',
    description: 'As tardes muito mais divertidas com os grandes sucessos.'
  },
  {
    id: '9',
    name: 'Modão da Boa',
    host: 'Equipe Boa FM',
    startTime: '17:00',
    endTime: '18:00',
    image: 'https://images.unsplash.com/photo-1514525253344-a8135a43cf3e?auto=format&fit=crop&q=80&w=400',
    description: 'A hora do modão raiz para o seu fim de tarde.'
  },
  {
    id: '10',
    name: 'The Flash',
    host: 'Equipe Boa FM',
    startTime: '18:00',
    endTime: '19:00',
    image: 'https://images.unsplash.com/photo-1459749411177-042180ce673c?auto=format&fit=crop&q=80&w=400',
    description: 'Os grandes clássicos que marcaram época no rádio.'
  },
  {
    id: '11',
    name: 'Top Likes (REDE BOA)',
    host: 'Luanne Trotta',
    startTime: '19:00',
    endTime: '20:00',
    image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&q=80&w=400',
    description: 'As músicas mais pedidas e curtidas da semana.'
  },
  {
    id: '12',
    name: 'Voz do Brasil',
    host: 'Governo Federal',
    startTime: '20:00',
    endTime: '21:00',
    image: 'https://images.unsplash.com/photo-1589262804704-c5aa9e66381d?auto=format&fit=crop&q=80&w=400',
    description: 'O noticiário oficial do Governo Federal.'
  },
  {
    id: '13',
    name: 'Noite de Amor',
    host: 'Equipe Boa FM',
    startTime: '21:00',
    endTime: '00:05',
    image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=400',
    description: 'Músicas românticas para embalar a sua noite.'
  }
];
