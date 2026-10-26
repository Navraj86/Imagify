import { PenLine, WandSparkles, Download } from 'lucide-react'
import sample_img_1 from './sample_img_1.png'
import sample_img_2 from './sample_img_2.png'
import profile_img_1 from './profile_img_1.png'
import profile_img_2 from './profile_img_2.png'

export const assets = {
    sample_img_1,
    sample_img_2,
    profile_img_1,
    profile_img_2,
}

export const stepsData = [
    {
      title: 'Write a prompt',
      description: 'Describe the image you want in a phrase, a sentence or a whole paragraph.',
      icon: PenLine,
    },
    {
      title: 'Generate',
      description: 'Imagify turns your prompt into an image. It usually takes a few seconds.',
      icon: WandSparkles,
    },
    {
      title: 'Download',
      description: 'Save the image as a PNG and use it wherever you need it.',
      icon: Download,
    },
  ];

export const testimonialsData = [
    {
        image:profile_img_1,
        name:'Donald Jackman',
        role:'Graphic Designer',
        stars:5,
        text:`I use it to sketch out ideas before I open a design tool. The results are usually close to what I had in mind.`
    },
    {
        image:profile_img_2,
        name:'Richard Nelson',
        role:'Content Creator',
        stars:4,
        text:`I make thumbnails with it every week. I like that I only pay for the images I generate.`
    },
    {
        image:profile_img_1,
        name:'Donald Jackman',
        role:'Graphic Designer',
        stars:5,
        text:`Easy to pick up. I type what I want, choose a style and download it.`
    },
]

export const plans = [
    {
      id: 'Basic',
      price: 10,
      credits: 100,
      desc: 'Best for personal use.'
    },
    {
      id: 'Advanced',
      price: 50,
      credits: 500,
      desc: 'Best for business use.',
      popular: true
    },
    {
      id: 'Business',
      price: 250,
      credits: 5000,
      desc: 'Best for enterprise use.'
    },
  ]

export const promptIdeas = [
    'A furry monster chef baking a birthday cake',
    'Neon-lit Tokyo street in the rain, cinematic, 35mm',
    'Cozy cabin in snowy mountains at golden hour',
    'Isometric floating island with waterfalls, soft pastel',
]

// Appended to the prompt when selected in the studio
export const stylePresets = [
    { id: 'none', label: 'No style', suffix: '' },
    { id: 'photo', label: 'Photo', suffix: 'photorealistic, highly detailed, natural lighting' },
    { id: '3d', label: '3D', suffix: '3D render, Pixar style, soft studio lighting' },
    { id: 'anime', label: 'Anime', suffix: 'anime style, vibrant colors, cel shading' },
    { id: 'watercolor', label: 'Watercolor', suffix: 'watercolor painting, soft textures, paper grain' },
    { id: 'cinematic', label: 'Cinematic', suffix: 'cinematic lighting, dramatic composition, 35mm film' },
]
