export function resetfilterAccordian(filters: any) {

    filters.filter((item: any) => {

        item.data.filter((i: any) => {
            i.selected = false
            return item
        })
    })
}


