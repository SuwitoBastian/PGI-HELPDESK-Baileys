const fs = require('fs');

const exportService = require('../services/exportService');
const ticketRepository = require('../repositories/ticketRepository');


async function exportExcel(req, res) {

    try {

const { start, end } = req.query;

const useFilter =
    start && end;

const tickets = useFilter
    ? ticketRepository.findAllByDate(start, end)
    : ticketRepository.findAll();

const open = useFilter
    ? ticketRepository.countOpenByDate(start, end)
    : ticketRepository.countOpen();

const process = useFilter
    ? ticketRepository.countProcessByDate(start, end)
    : ticketRepository.countProcess();

const closed = useFilter
    ? ticketRepository.countClosedByDate(start, end)
    : ticketRepository.countClosed();

const topCabang = useFilter
    ? ticketRepository.topCabangByDate(10, start, end)
    : ticketRepository.topCabang(10);

const topPICSelesai = useFilter
    ? ticketRepository.topPICSelesaiByDate(6, start, end)
    : ticketRepository.topPICSelesai(6);

const result =
    await exportService.exportTickets({

        tickets,

        open,

        process,

        closed,

        topCabang,

        topPICSelesai,

        start,

        end

    });

        if (!result.success) {

            return res.status(500).json({

                success: false,

                message: 'Export gagal.'

            });

        }

        res.download(

            result.filePath,

            result.fileName,

            (err) => {

                if (err) {

                    console.error(err);

                    return;

                }

                if (fs.existsSync(result.filePath)) {

                    fs.unlinkSync(result.filePath);

                }

            }

        );

    } catch (err) {

        console.error(err);

        res.status(500).json({

            success: false,

            message: 'Terjadi kesalahan saat export.'

        });

    }

}

module.exports = {

    exportExcel

};