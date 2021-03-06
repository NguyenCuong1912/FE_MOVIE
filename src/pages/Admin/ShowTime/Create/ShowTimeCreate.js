import React, { useState, useEffect } from 'react'
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux'
import {
    Form,
    Select,
    DatePicker,
    InputNumber
} from 'antd';
import { layDanhSachCumRapAction } from '../../../../redux/Actions/QuanLyCumRapAction';
import { quanLyRapChieuServices } from '../../../../services/QuanLyRapChieuServices';
import { useFormik } from 'formik';
import * as Yup from "yup";
import { layDanhSachPhimAction } from '../../../../redux/Actions/QuanLyPhimAction';
import { quanLyPhongServices } from '../../../../services/QuanLyPhongServices';
import { themLichChieuAction } from '../../../../redux/Actions/QuanLyLichChieuAction';
export default function ShowTimeCreate(props) {
    const dispatch = useDispatch();
    const { lstPhim } = useSelector(state => state.QuanLyPhimReducer);
    const { lstGroupCinemas } = useSelector(state => state.QuanLyCumRapReducer);
    useEffect(() => {
        dispatch(layDanhSachPhimAction());
        dispatch(layDanhSachCumRapAction());

    }, [])
    const [state, setState] = useState({ lstRap: [], lstRoom: [] })
    const changeGroupCinema = async (value) => {
        const result = await quanLyRapChieuServices.layRapChieuTheoMaCumRap(value);
        if (result.status === 200) {
            formik.setFieldValue('idCinema', '')
            await setState({ ...state, lstRap: result.data })
        }
    }
    const changeCinema = async (value) => {
        formik.setFieldValue('idCinema', value)
        const result = await quanLyPhongServices.layPhongTheoIDCinema(value);
        if (result.status === 200) {
            formik.setFieldValue('idRoom', '')
            await setState({ ...state, lstRoom: result.data })
        }
    }
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            idFilm: '',
            showDate: '',
            idCinema: '',
            idRoom: '',
            price: ''
        },
        validationSchema: Yup.object({
            idRoom: Yup.string()
                .required("Kh??ng ???????c tr???ng !"),
            idCinema: Yup.string()
                .required("Kh??ng ???????c tr???ng !"),
            idFilm: Yup.string()
                .required("Kh??ng ???????c tr???ng !"),
            showDate: Yup.string()
                .required("Kh??ng ???????c ????? tr???ng !"),
            price: Yup.string()
                .required("Kh??ng ???????c ????? tr???ng !"),
        }),
        onSubmit: (values) => {
            dispatch(themLichChieuAction(values));
        },
    })
    const handleChange = (name) => {
        if (name === 'price') {
            return (value) => {
                formik.setFieldValue(name, String(value));
            }
        } else {
            return (value) => {
                formik.setFieldValue(name, value);
            }
        }

    }
    function onOk(value) {
        const time = moment(value).format("YYYY-MM-DD hh:mm:ss")
        formik.setFieldValue('showDate', time)
    }
    const { Option } = Select;
    return (
        <div>
            <h2 className='text-center my-4 text-2xl'>Th??m L???ch Chi???u</h2>
            <Form
                onSubmitCapture={formik.handleSubmit}
                labelCol={{
                    span: 4,
                }}
                wrapperCol={{
                    span: 14,
                }}
                layout="horizontal"
                initialValues={{
                    size: 'default',
                }}
                size='default'
            >
                <Form.Item label="T??n Phim">
                    <Select
                        showSearch
                        style={{ width: 500 }}
                        placeholder="Ch???n Phim"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }
                        filterSort={(optionA, optionB) =>
                            optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                        }
                        onChange={handleChange('idFilm')}
                    >
                        {lstPhim.map((film, index) => {
                            return <Option key={index} value={film.id}>{film.nameFilm}</Option>
                        })}
                    </Select>
                    {formik.errors.idFilm && formik.touched.idFilm && (
                        <p className='m-0 mt-1 text-red-600'>{formik.errors.idFilm}</p>
                    )}
                </Form.Item>
                <Form.Item label="C???m R???p">
                    <Select placeholder='Ch???n C???m R???p' onChange={changeGroupCinema}>
                        {lstGroupCinemas.map((group, index) => {
                            return <Select.Option key={index} value={group.id}>{group.groupName}</Select.Option>
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label="R???p">
                    <Select placeholder='Ch???n R???p' name='idCinema' onChange={changeCinema}>
                        {state.lstRap?.map((cinema, index) => {
                            return <Select.Option key={index} value={cinema.id}>{cinema.name}</Select.Option>
                        })}
                    </Select>
                    {formik.errors.idCinema && formik.touched.idCinema && (
                        <p className='m-0 mt-1 text-red-600'>{formik.errors.idCinema}</p>
                    )}
                </Form.Item>
                <Form.Item label="Ph??ng">
                    <Select placeholder='Ch???n Ph??ng' name='idRoom' onChange={handleChange('idRoom')} >
                        {state.lstRoom?.map((room, index) => {
                            return <Select.Option key={index} value={room.id}>{room.roomName}</Select.Option>
                        })}
                    </Select>
                    {formik.errors.idRoom && formik.touched.idRoom && (
                        <p className='m-0 mt-1 text-red-600'>{formik.errors.idRoom}</p>
                    )}
                </Form.Item>
                <Form.Item label='Ng??y chi???u'>
                    <DatePicker format="DD/MM/YYYY hh:mm:ss" showTime onOk={onOk} />
                    {formik.errors.showDate && formik.touched.showDate && (
                        <p className='m-0 mt-1 text-red-600'>{formik.errors.showDate}</p>
                    )}
                </Form.Item>
                <Form.Item label='Gi?? v??'>
                    <InputNumber min={0} defaultValue={0} onChange={handleChange('price')} />
                    {formik.errors.price && formik.touched.price && (
                        <p className='m-0 mt-1 text-red-600'>{formik.errors.price}</p>
                    )}
                </Form.Item>
                <div className='text-center '>
                    <button className='border bg-sky-300 text-white border-white px-5 py-2 rounded' type='submit' >Th??m</button>
                </div>
            </Form>
        </div>
    )
}
