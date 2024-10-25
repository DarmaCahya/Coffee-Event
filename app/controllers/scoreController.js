const db = require("../models");
const Score = db.score;
const Event = db.event;
const Op = db.Sequelize.Op;

exports.createScore = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.userId;

        const event = await Event.findByPk(eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event tidak ditemukan' });
        }

        // const existingScore = await Score.findOne({
        //     where: {
        //         eventId: eventId,
        //         userId: userId
        //     }
        // });

        // if(existingScore){
        //     return res.status(400).json({ message: 'Anda telah memberikan penilaian untuk event ini' });
        // }

        const {
            representing,
            competitor,
            judge,
            espresso_flush_head1,
            espresso_flush_head2,
            espresso_flush_head_dsgn,
            espresso_dry_filter1,
            espresso_dry_filter2,
            espresso_dry_filter_dsgn,
            espresso_spill1,
            espresso_spill2,
            espresso_spill_dsgn,
            espresso_dosing1,
            espresso_dosing2,
            espresso_dosing_dsgn,
            espresso_clean_port1,
            espresso_clean_port2,
            espresso_clean_port_dsgn,
            espresso_brew1,
            espresso_brew2,
            espresso_brew_dsgn,
            espresso_extract_time1,
            espresso_extract_time2,
            espresso_extract_time_dsgn,
            milk_clean_pitcher1,
            milk_clean_pitcher2,
            milk_clean_pitcher_dsgn,
            milk_purge_wand_before1,
            milk_purge_wand_before2,
            milk_purge_wand_before_dsgn,
            milk_clean_wand1,
            milk_clean_wand2,
            milk_clean_wand_dsgn,
            milk_purge_wand_after1,
            milk_purge_wand_after2,
            milk_purge_wand_after_dsgn,
            milk_pitcher_waste_end1,
            milk_pitcher_waste_end2,
            milk_pitcher_waste_end_dsgn,
            hygiene_clean_wand,
            performance_org_workspace,
            performance_overall
        } = req.body;

        const toBinary = (value) => value === 'yes' ? 1 : 0;

        const calculateEspressoTotal = (flushHead, dryFilter, spill, dosing, cleanPort, brew, extractTime) => {
            return (
                (flushHead === 'yes' ? 1 : 0) +
                (dryFilter === 'yes' ? 1 : 0) +
                (spill === 'yes' ? 1 : 0) +
                (dosing === 'yes' ? 1 : 0) +
                (cleanPort === 'yes' ? 1 : 0) +
                (brew === 'yes' ? 1 : 0) +
                (extractTime === 'yes' ? 4 : 0)
            );
        };

        const calculateMilkTotal = (cleanPitcher, purgeBefore, cleanWand, purgeAfter, pitcherWasteEnd) => {
            return (
                (cleanPitcher === 'yes' ? 1 : 0) +
                (purgeBefore === 'yes' ? 1 : 0) +
                (cleanWand === 'yes' ? 1 : 0) +
                (purgeAfter === 'yes' ? 1 : 0) +
                (pitcherWasteEnd === 'yes' ? 1 : 0)
            );
        };

        const calculateHygieneTotal = (cleanWand) => {
            const totalPoints = cleanWand ? cleanWand : 0;
            return totalPoints * 2;
        };

        const calculatePerformanceTotal = (orgWorkspace, overall) => {
            const orgWorkspaceNum = parseInt(orgWorkspace) || 0;
            const overallNum = parseInt(overall) || 0;
        
            return (
                orgWorkspaceNum + (overallNum * 6)
            );
        };        

        const espresso_total1 = calculateEspressoTotal(
            espresso_flush_head1,
            espresso_dry_filter1,
            espresso_spill1,
            espresso_dosing1,
            espresso_clean_port1,
            espresso_brew1,
            espresso_extract_time1
        );

        const espresso_total2 = calculateEspressoTotal(
            espresso_flush_head2,
            espresso_dry_filter2,
            espresso_spill2,
            espresso_dosing2,
            espresso_clean_port2,
            espresso_brew2,
            espresso_extract_time2
        );

        const espresso_total_dsgn = calculateEspressoTotal(
            espresso_flush_head_dsgn,
            espresso_dry_filter_dsgn,
            espresso_spill_dsgn,
            espresso_dosing_dsgn,
            espresso_clean_port_dsgn,
            espresso_brew_dsgn,
            espresso_extract_time_dsgn
        );

        const milk_total1 = calculateMilkTotal(
            milk_clean_pitcher1,
            milk_purge_wand_before1,
            milk_clean_wand1,
            milk_purge_wand_after1,
            milk_pitcher_waste_end1
        );

        const milk_total2 = calculateMilkTotal(
            milk_clean_pitcher2,
            milk_purge_wand_before2,
            milk_clean_wand2,
            milk_purge_wand_after2,
            milk_pitcher_waste_end2
        );

        const milk_total_dsgn = calculateMilkTotal(
            milk_clean_pitcher_dsgn,
            milk_purge_wand_before_dsgn,
            milk_clean_wand_dsgn,
            milk_purge_wand_after_dsgn,
            milk_pitcher_waste_end_dsgn
        );

        const hygiene_total = calculateHygieneTotal(hygiene_clean_wand);

        const performance_total = calculatePerformanceTotal(
            performance_org_workspace,
            performance_overall
        );

        const total_score =
            espresso_total1 +
            espresso_total2 +
            espresso_total_dsgn +
            milk_total1 +
            milk_total2 +
            milk_total_dsgn +
            hygiene_total +
            performance_total;

        const newScore = await Score.create({
            eventId,
            userId,
            representing,
            competitor,
            judge,
            espresso_flush_head1: toBinary(espresso_flush_head1),
            espresso_flush_head2: toBinary(espresso_flush_head2),
            espresso_flush_head_dsgn: toBinary(espresso_flush_head_dsgn),
            espresso_dry_filter1: toBinary(espresso_dry_filter1),
            espresso_dry_filter2: toBinary(espresso_dry_filter2),
            espresso_dry_filter_dsgn: toBinary(espresso_dry_filter_dsgn),
            espresso_spill1: toBinary(espresso_spill1),
            espresso_spill2: toBinary(espresso_spill2),
            espresso_spill_dsgn: toBinary(espresso_spill_dsgn),
            espresso_dosing1: toBinary(espresso_dosing1),
            espresso_dosing2: toBinary(espresso_dosing2),
            espresso_dosing_dsgn: toBinary(espresso_dosing_dsgn),
            espresso_clean_port1: toBinary(espresso_clean_port1),
            espresso_clean_port2: toBinary(espresso_clean_port2),
            espresso_clean_port_dsgn: toBinary(espresso_clean_port_dsgn),
            espresso_brew1: toBinary(espresso_brew1),
            espresso_brew2: toBinary(espresso_brew2),
            espresso_brew_dsgn: toBinary(espresso_brew_dsgn),
            espresso_extract_time1: toBinary(espresso_extract_time1),
            espresso_extract_time2: toBinary(espresso_extract_time2),
            espresso_extract_time_dsgn: toBinary(espresso_extract_time_dsgn),
            espresso_total1,
            espresso_total2,
            espresso_total_dsgn,
            milk_clean_pitcher1: toBinary(milk_clean_pitcher1),
            milk_clean_pitcher2: toBinary(milk_clean_pitcher2),
            milk_clean_pitcher_dsgn: toBinary(milk_clean_pitcher_dsgn),
            milk_purge_wand_before1: toBinary(milk_purge_wand_before1),
            milk_purge_wand_before2: toBinary(milk_purge_wand_before2),
            milk_purge_wand_before_dsgn: toBinary(milk_purge_wand_before_dsgn),
            milk_clean_wand1: toBinary(milk_clean_wand1),
            milk_clean_wand2: toBinary(milk_clean_wand2),
            milk_clean_wand_dsgn: toBinary(milk_clean_wand_dsgn),
            milk_purge_wand_after1: toBinary(milk_purge_wand_after1),
            milk_purge_wand_after2: toBinary(milk_purge_wand_after2),
            milk_purge_wand_after_dsgn: toBinary(milk_purge_wand_after_dsgn),
            milk_pitcher_waste_end1: toBinary(milk_pitcher_waste_end1),
            milk_pitcher_waste_end2: toBinary(milk_pitcher_waste_end2),
            milk_pitcher_waste_end_dsgn: toBinary(milk_pitcher_waste_end_dsgn),
            milk_total1,
            milk_total2,
            milk_total_dsgn,
            hygiene_clean_wand,
            hygiene_total,
            performance_org_workspace,
            performance_overall,
            performance_total,
            total_score
        });

        res.redirect(`/event/${eventId}`);
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan saat membuat penilaian" });
    }
};

exports.getScores = async (eventId) => {
    try {
        const scores = await Score.findAll({ where: { eventId } });

        if (!scores.length) {
            throw new Error('Tidak ada penilaian yang ditemukan');
        }
        
        return scores;
    } catch (error) {
        throw new Error("terjadi kesalahan saat mengambil penilaian");
    }
};

exports.getScoreById = async (req, res) => {
    const { id, idScore } = req.params;
    const userId = req.userId;
    try {
        const score = await Score.findOne({
            where: {
                id: idScore,
                eventId: id,
                userId: userId
            }
        });

        if (!score) {
            return res.status(404).json({ message: "penilaian tidak ditemukan" });
        }
        
        return score; 
    } catch (error) {
        res.status(500).json({ message: `Terjadi kesalahan saat mengambil penilaian dengan id=${idScore}` });
    }
};

exports.deleteScore = async (req, res) => {
    const id = req.params.id;
    const eventId = req.params.eventId;

    try {
        const num = await Score.destroy({
            where: { id: id }
        });

        if (num == 1) {
            res.redirect(`/event/${eventId}`); 
        } else {
            res.status(404).send({ message: `Tidak dapat menghapus penilaian dengan id=${id}. Penilaian mungkin tidak ditemukan!` });
        }
    } catch (err) {
        res.status(500).send({ message: `Tidak dapat menghapus penilaian dengan id=${id}.`});
    }
};

exports.updateScore = async (req, res) => {
    const idScore = req.params.idScore; 
    const id = req.params.id;
    const scoreData = req.body;

    const {
        espresso_flush_head1,
        espresso_flush_head2,
        espresso_flush_head_dsgn,
        espresso_dry_filter1,
        espresso_dry_filter2,
        espresso_dry_filter_dsgn,
        espresso_spill1,
        espresso_spill2,
        espresso_spill_dsgn,
        espresso_dosing1,
        espresso_dosing2,
        espresso_dosing_dsgn,
        espresso_clean_port1,
        espresso_clean_port2,
        espresso_clean_port_dsgn,
        espresso_brew1,
        espresso_brew2,
        espresso_brew_dsgn,
        espresso_extract_time1,
        espresso_extract_time2,
        espresso_extract_time_dsgn,
        milk_clean_pitcher1,
        milk_clean_pitcher2,
        milk_clean_pitcher_dsgn,
        milk_purge_wand_before1,
        milk_purge_wand_before2,
        milk_purge_wand_before_dsgn,
        milk_clean_wand1,
        milk_clean_wand2,
        milk_clean_wand_dsgn,
        milk_purge_wand_after1,
        milk_purge_wand_after2,
        milk_purge_wand_after_dsgn,
        milk_pitcher_waste_end1,
        milk_pitcher_waste_end2,
        milk_pitcher_waste_end_dsgn,
        hygiene_clean_wand,
        performance_org_workspace,
        performance_overall
    } = scoreData;

    const toBinary = (value) => value === 'yes' ? 1 : 0;

    const calculateEspressoTotal = (flushHead, dryFilter, spill, dosing, cleanPort, brew, extractTime) => {
        return (
            (flushHead === 'yes' ? 1 : 0) +
            (dryFilter === 'yes' ? 1 : 0) +
            (spill === 'yes' ? 1 : 0) +
            (dosing === 'yes' ? 1 : 0) +
            (cleanPort === 'yes' ? 1 : 0) +
            (brew === 'yes' ? 1 : 0) +
            (extractTime === 'yes' ? 4 : 0)
        );
    };

    const calculateMilkTotal = (cleanPitcher, purgeBefore, cleanWand, purgeAfter, pitcherWasteEnd) => {
        return (
            (cleanPitcher === 'yes' ? 1 : 0) +
            (purgeBefore === 'yes' ? 1 : 0) +
            (cleanWand === 'yes' ? 1 : 0) +
            (purgeAfter === 'yes' ? 1 : 0) +
            (pitcherWasteEnd === 'yes' ? 1 : 0)
        );
    };

    const calculateHygieneTotal = (cleanWand) => {
        const totalPoints = cleanWand ? cleanWand : 0;
        return totalPoints * 2;
    };

    const calculatePerformanceTotal = (orgWorkspace, overall) => {
        const orgWorkspaceNum = parseInt(orgWorkspace) || 0;
        const overallNum = parseInt(overall) || 0;
    
        return (
            orgWorkspaceNum + (overallNum * 6)
        );
    };        

    const espresso_total1 = calculateEspressoTotal(
        espresso_flush_head1,
        espresso_dry_filter1,
        espresso_spill1,
        espresso_dosing1,
        espresso_clean_port1,
        espresso_brew1,
        espresso_extract_time1
    );

    const espresso_total2 = calculateEspressoTotal(
        espresso_flush_head2,
        espresso_dry_filter2,
        espresso_spill2,
        espresso_dosing2,
        espresso_clean_port2,
        espresso_brew2,
        espresso_extract_time2
    );

    const espresso_total_dsgn = calculateEspressoTotal(
        espresso_flush_head_dsgn,
        espresso_dry_filter_dsgn,
        espresso_spill_dsgn,
        espresso_dosing_dsgn,
        espresso_clean_port_dsgn,
        espresso_brew_dsgn,
        espresso_extract_time_dsgn
    );

    const milk_total1 = calculateMilkTotal(
        milk_clean_pitcher1,
        milk_purge_wand_before1,
        milk_clean_wand1,
        milk_purge_wand_after1,
        milk_pitcher_waste_end1
    );

    const milk_total2 = calculateMilkTotal(
        milk_clean_pitcher2,
        milk_purge_wand_before2,
        milk_clean_wand2,
        milk_purge_wand_after2,
        milk_pitcher_waste_end2
    );

    const milk_total_dsgn = calculateMilkTotal(
        milk_clean_pitcher_dsgn,
        milk_purge_wand_before_dsgn,
        milk_clean_wand_dsgn,
        milk_purge_wand_after_dsgn,
        milk_pitcher_waste_end_dsgn
    );

    const hygiene_total = calculateHygieneTotal(hygiene_clean_wand);

    const performance_total = calculatePerformanceTotal(
        performance_org_workspace,
        performance_overall
    );

    const total_score =
        espresso_total1 +
        espresso_total2 +
        espresso_total_dsgn +
        milk_total1 +
        milk_total2 +
        milk_total_dsgn +
        hygiene_total +
        performance_total;

    const updatedScoreData = {
        ...scoreData,
        espresso_flush_head1: toBinary(espresso_flush_head1),
        espresso_flush_head2: toBinary(espresso_flush_head2),
        espresso_flush_head_dsgn: toBinary(espresso_flush_head_dsgn),
        espresso_dry_filter1: toBinary(espresso_dry_filter1),
        espresso_dry_filter2: toBinary(espresso_dry_filter2),
        espresso_dry_filter_dsgn: toBinary(espresso_dry_filter_dsgn),
        espresso_spill1: toBinary(espresso_spill1),
        espresso_spill2: toBinary(espresso_spill2),
        espresso_spill_dsgn: toBinary(espresso_spill_dsgn),
        espresso_dosing1: toBinary(espresso_dosing1),
        espresso_dosing2: toBinary(espresso_dosing2),
        espresso_dosing_dsgn: toBinary(espresso_dosing_dsgn),
        espresso_clean_port1: toBinary(espresso_clean_port1),
        espresso_clean_port2: toBinary(espresso_clean_port2),
        espresso_clean_port_dsgn: toBinary(espresso_clean_port_dsgn),
        espresso_brew1: toBinary(espresso_brew1),
        espresso_brew2: toBinary(espresso_brew2),
        espresso_brew_dsgn: toBinary(espresso_brew_dsgn),
        espresso_extract_time1: toBinary(espresso_extract_time1),
        espresso_extract_time2: toBinary(espresso_extract_time2),
        espresso_extract_time_dsgn: toBinary(espresso_extract_time_dsgn),
        espresso_total1,
        espresso_total2,
        espresso_total_dsgn,
        milk_clean_pitcher1: toBinary(milk_clean_pitcher1),
        milk_clean_pitcher2: toBinary(milk_clean_pitcher2),
        milk_clean_pitcher_dsgn: toBinary(milk_clean_pitcher_dsgn),
        milk_purge_wand_before1: toBinary(milk_purge_wand_before1),
        milk_purge_wand_before2: toBinary(milk_purge_wand_before2),
        milk_purge_wand_before_dsgn: toBinary(milk_purge_wand_before_dsgn),
        milk_clean_wand1: toBinary(milk_clean_wand1),
        milk_clean_wand2: toBinary(milk_clean_wand2),
        milk_clean_wand_dsgn: toBinary(milk_clean_wand_dsgn),
        milk_purge_wand_after1: toBinary(milk_purge_wand_after1),
        milk_purge_wand_after2: toBinary(milk_purge_wand_after2),
        milk_purge_wand_after_dsgn: toBinary(milk_purge_wand_after_dsgn),
        milk_pitcher_waste_end1: toBinary(milk_pitcher_waste_end1),
        milk_pitcher_waste_end2: toBinary(milk_pitcher_waste_end2),
        milk_pitcher_waste_end_dsgn: toBinary(milk_pitcher_waste_end_dsgn),
        milk_total1,
        milk_total2,
        milk_total_dsgn,
        hygiene_clean_wand,
        hygiene_total,
        performance_org_workspace,
        performance_overall,
        performance_total,
        total_score
    };

    try {
        const [num] = await Score.update(updatedScoreData, {
            where: { id: idScore }
        });

        if (num == 1) {
            res.redirect(`/event/${id}`);
        } else {
            res.send({ message: `Tidak dapat merubah penilaian dengan id=${idScore}. Mungkin Skor tidak ditemukan atau req.body kosong!` });
        }
    } catch (err) {
        res.status(500).send({ message: `Terjadi kesalahan saat merubah penilaian dengan id=${idScore}` });
    }
};


exports.searchScores = async (req, res) => {
    const { field, value } = req.body;

    try {
        const scores = await Score.findAll({
            where: {
                [field]: {
                    [Op.like]: `%${value}%`
                }
            }
        });

        if (scores.length === 0) {
            return res.status(404).json({ message: "Penilaian tidak ditemukan." });
        } else {
            res.status(200).json(scores);
        }
    } catch (error) {
        res.status(500).send({ message: `Terjadi kesalahan saat mencari penilaian ${field}=${value}` });
    }
};