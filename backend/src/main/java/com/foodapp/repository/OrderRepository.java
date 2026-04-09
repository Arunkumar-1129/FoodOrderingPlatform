package com.foodapp.repository;

import com.foodapp.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Order> findByStatus(Order.OrderStatus status);
    List<Order> findAllByOrderByCreatedAtDesc();
}
