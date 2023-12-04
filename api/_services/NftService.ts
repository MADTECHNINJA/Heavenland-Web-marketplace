import { Path, SubPath } from '@/api/resources';

export type ImageAddress = { resource: ImageResource; address: string };

export enum ImageResource {
    TOKEN,
    URL,
}

export enum ImageSize {
    FULL = 'full',
    W500 = 'w500',
}

class NftService {
    getImage(imageAddress: ImageAddress, size?: ImageSize): string {
        let img = null;

        switch (imageAddress.resource) {
            case ImageResource.TOKEN:
                img = imageAddress.address;
                break;

            case ImageResource.URL:
                img = 'url:' + encodeURIComponent(imageAddress.address);
                break;

            default:
                throw new Error('invalid: image resource');
        }

        const imgSize = size ?? ImageSize.W500;

        return `${import.meta.env.VITE_HL_API_URL}/${Path.NFTS}/${SubPath.NFTS.IMAGES}/${img}?size=${imgSize}`;
    }

    getData(mint: string) {
        return import.meta.env.VITE_HL_API_URL + `/${Path.NFTS}/${SubPath.NFTS.METADATA}/` + mint;
    }
}

export default new NftService();
