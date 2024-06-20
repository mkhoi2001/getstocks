import { prisma } from 'prisma/prisma-client'
import defaultService from '../services/default.service'
import stockService from '../services/stock.service'
import systemService from '../services/system.service'
import { getDomain } from '../utils/getDomain'

const data = [
  {
    name: '123rf Plus',
    host: 'https://www.123rf.com/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: '123rf Pre',
    host: 'https://www.123rf.com/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'Adobestock',
    host: 'https://stock.adobe.com/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'Adobestock VidHD',
    host: 'https://stock.adobe.com/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'Alamy photo',
    host: 'https://www.alamy.com/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'Artgrid 4K',
    host: 'https://artgrid.io/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'Artgrid HD',
    host: 'https://artgrid.io/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'Artgrid LOG',
    host: 'https://artgrid.io/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'Artgrid RAW',
    host: 'https://artgrid.io/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'Artlist',
    host: 'https://artlist.io/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'Artlist & License',
    host: 'https://artlist.io/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'Audiio',
    host: 'https://audiio.com/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'Brandpacks',
    host: 'https://brandpacks.com/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'Creative Fabrica',
    host: 'https://www.creativefabrica.com/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'Deeezy',
    host: 'https://deeezy.com/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'Depositphotos',
    host: 'https://depositphotos.com/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'Dreamstime',
    host: 'https://www.dreamstime.com/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'Elements Envato',
    host: 'https://elements.envato.com/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'Elements Envato 3D',
    host: 'https://elements.envato.com/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'Epidemicsound',
    host: 'https://www.epidemicsound.com/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'Flaticon icon',
    host: 'https://www.flaticon.com/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'Flaticon packs',
    host: 'https://www.flaticon.com/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'Footagecrate',
    host: 'https://footagecrate.com/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'Freepik',
    host: 'https://www.freepik.com/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'Freepik Video',
    host: 'https://www.freepik.com/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'Gettyimages Video 720',
    host: 'https://www.gettyimages.com/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'iStockphoto',
    host: 'https://www.istockphoto.com/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'iStockphoto Video 4K',
    host: 'https://www.istockphoto.com/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'iStockphoto Video 720',
    host: 'https://www.istockphoto.com/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'iStockphoto Video HD',
    host: 'https://www.istockphoto.com/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'Lovepik',
    host: 'https://lovepik.com/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'Motionarray',
    host: 'https://motionarray.com/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'Motionelements',
    host: 'https://www.motionelements.com/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'Musicbed',
    host: 'https://www.musicbed.com/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'OOOPic',
    host: 'https://www.ooopic.com/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'Pikbest',
    host: 'https://pikbest.com/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'Pixelsquid',
    host: 'https://www.pixelsquid.com/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'PNGTree',
    host: 'https://pngtree.com/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'Powered Template',
    host: 'https://poweredtemplate.com/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'Powered Template Adv',
    host: 'https://poweredtemplate.com/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'Rawpixel',
    host: 'https://www.rawpixel.com/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'Shutterstock',
    host: 'https://www.shutterstock.com/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'Shutterstock Editorial',
    host: 'https://www.shutterstock.com/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'Shutterstock Music',
    host: 'https://www.shutterstock.com/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'Shutterstock Video 4K',
    host: 'https://www.shutterstock.com/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'Shutterstock Video 4K Select',
    host: 'https://www.shutterstock.com/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'Shutterstock Video HD',
    host: 'https://www.shutterstock.com/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'Shutterstock Video HD Select',
    host: 'https://www.shutterstock.com/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'Soundstripe',
    host: 'https://www.soundstripe.com/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'Storyblocks',
    host: 'https://www.storyblocks.com/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'Unlimphotos',
    host: 'https://unlimphotos.com/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'Utoimage',
    host: 'https://www.utoimage.com/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'Vecteezy',
    host: 'https://www.vecteezy.com/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'Vectorgrove',
    host: 'https://vectorgrove.com/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'Vectorstock',
    host: 'https://www.vectorstock.com/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'Vexels',
    host: 'https://www.vexels.com/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  },
  {
    name: 'Yellowimages',
    host: 'https://yellowimages.com/',
    stockTypes: [
      {
        type: 'P',
        price: 2
      },
      {
        type: 'G',
        price: 2
      }
    ]
  }
]

export const importStocks = async () => {
  const systemId = await defaultService.getDefaultDataByType('getstocks')
  if (!systemId) {
    return null
  }

  const system = await systemService.getSystemById(systemId.dataId)
  if (!system) {
    return null
  }

  const dataPromise: any = []
  let domain
  let stockFind
  await Promise.all([
    data.forEach(async (item: any) => {
      domain = await getDomain(item.host)
      stockFind = await prisma.stock.findFirst({ where: { name: item.name, host: domain } })
      if (!stockFind) {
        console.log('create : ', item.name, '')
        dataPromise.push(stockService.createStock({ ...item, systemId: system.id }))
      } else {
        console.log('item : ', item.name, ' is already in stocks')
      }
    }),
    console.log('new stock: ', dataPromise.length)
  ])

  if (dataPromise.length > 0) {
    await Promise.all(dataPromise)
  }
}
